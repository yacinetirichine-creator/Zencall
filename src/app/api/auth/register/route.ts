import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';

// Schéma de validation pour l'inscription
const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  fullName: z.string().min(2, 'Le nom complet est requis'),
  organizationType: z.enum(['b2b', 'b2c']),
  
  // Champs B2B uniquement
  companyName: z.string().optional(),
  companyRegistration: z.string().optional(), // SIRET/SIREN
  vatNumber: z.string().optional(),
  
  // Consentements RGPD
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'Vous devez accepter les conditions générales'
  }),
  privacyAccepted: z.boolean().refine((val) => val === true, {
    message: 'Vous devez accepter la politique de confidentialité'
  }),
  marketingConsent: z.boolean().optional(),
  
  // Métadonnées pour audit RGPD
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    const supabase = await createClient();

    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', data.email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Créer l'utilisateur avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
      },
    });

    if (authError) {
      console.error('Erreur création auth:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du compte' },
        { status: 500 }
      );
    }

    // Créer l'organisation
    const organizationName = data.organizationType === 'b2b' 
      ? (data.companyName || `Organisation de ${data.fullName}`)
      : `Mon compte ${data.fullName}`;

    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: organizationName,
        organization_type: data.organizationType,
        company_registration: data.companyRegistration,
        vat_number: data.vatNumber,
      })
      .select()
      .single();

    if (orgError || !org) {
      console.error('Erreur création organisation:', orgError);
      // Supprimer l'utilisateur Auth si l'organisation échoue
      await supabase.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'organisation' },
        { status: 500 }
      );
    }

    // Créer le profil utilisateur
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: data.email,
        full_name: data.fullName,
        organization_id: org.id,
        role: 'admin', // Premier utilisateur = admin
        gdpr_consent_at: new Date().toISOString(),
        terms_accepted_at: new Date().toISOString(),
        marketing_consent: data.marketingConsent || false,
      });

    if (profileError) {
      console.error('Erreur création profil:', profileError);
      // Nettoyer en cas d'erreur
      await supabase.from('organizations').delete().eq('id', org.id);
      await supabase.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: 'Erreur lors de la création du profil' },
        { status: 500 }
      );
    }

    // Enregistrer les consentements RGPD
    const consents = [
      {
        user_id: userId,
        consent_type: 'terms',
        consent_given: data.termsAccepted,
        consent_version: '1.0',
        ip_address: data.ipAddress || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: data.userAgent || request.headers.get('user-agent'),
      },
      {
        user_id: userId,
        consent_type: 'privacy',
        consent_given: data.privacyAccepted,
        consent_version: '1.0',
        ip_address: data.ipAddress || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: data.userAgent || request.headers.get('user-agent'),
      },
    ];

    if (data.marketingConsent !== undefined) {
      consents.push({
        user_id: userId,
        consent_type: 'marketing',
        consent_given: data.marketingConsent,
        consent_version: '1.0',
        ip_address: data.ipAddress || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: data.userAgent || request.headers.get('user-agent'),
      });
    }

    const { error: consentError } = await supabase
      .from('gdpr_consents')
      .insert(consents);

    if (consentError) {
      console.error('Erreur enregistrement consentements:', consentError);
      // Ne pas bloquer l'inscription pour ça, juste logger
    }

    // Audit log RGPD
    await supabase.from('gdpr_audit_logs').insert({
      user_id: userId,
      organization_id: org.id,
      action: 'account_created',
      details: {
        organization_type: data.organizationType,
        marketing_consent: data.marketingConsent,
      },
      ip_address: data.ipAddress || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      user_agent: data.userAgent || request.headers.get('user-agent'),
    });

    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès. Vérifiez votre email pour confirmer votre adresse.',
      user: {
        id: userId,
        email: data.email,
        fullName: data.fullName,
      },
      organization: {
        id: org.id,
        name: org.name,
        type: org.organization_type,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur inscription:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
