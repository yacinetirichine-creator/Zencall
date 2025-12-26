"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, Lock, User, Building, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/i18n/provider";

export default function RegisterPage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", organizationName: "" });
  const [legalConsent, setLegalConsent] = useState({
    cgu: false,
    cgv: false,
    privacy: false,
    marketing: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate legal consent
    if (!legalConsent.cgu || !legalConsent.cgv || !legalConsent.privacy) {
      setError("Vous devez accepter les CGU, CGV et la Politique de Confidentialité pour continuer.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    try {
      const supabase = createClient();
      
      // Get user IP and User Agent for legal tracking
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();
      const userAgent = navigator.userAgent;
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { 
          data: { 
            full_name: formData.fullName, 
            organization_name: formData.organizationName,
            legal_consent: {
              cgu: legalConsent.cgu,
              cgv: legalConsent.cgv,
              privacy: legalConsent.privacy,
              marketing: legalConsent.marketing,
              ip_address: ip,
              user_agent: userAgent,
              accepted_at: new Date().toISOString(),
              cgu_version: '1.0',
              cgv_version: '1.0',
              privacy_version: '1.0',
            }
          } 
        },
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || t("auth.register.errorFallback"));
    } finally {
      setIsLoading(false);
    }
  };
  
  const isFormValid = formData.fullName && formData.email && formData.password && formData.organizationName && legalConsent.cgu && legalConsent.cgv && legalConsent.privacy;

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zencall-coral-50 via-white to-zencall-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-zencall-mint-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-zencall-mint-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">{t("auth.register.verifyTitle")}</h2>
          <p className="text-gray-600 mb-6">{t("auth.register.verifyBody", { email: formData.email })}</p>
          <Link href="/login" className="bg-zencall-coral-200 text-gray-800 px-6 py-2.5 rounded-xl font-medium inline-block">{t("auth.register.backToLogin")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zencall-coral-50 via-white to-zencall-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zencall-coral-200 to-zencall-coral-300 flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-gray-800">Zencall</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-gray-900">{t("auth.register.title")}</h1>
          <p className="text-gray-600 mt-2">{t("auth.register.subtitle")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("auth.register.fullName")}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required placeholder={t("auth.register.namePlaceholder")} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-zencall-coral-200 focus:ring-2 focus:ring-zencall-coral-100 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("auth.register.company")}</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={formData.organizationName} onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })} required placeholder={t("auth.register.companyPlaceholder")} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-zencall-coral-200 focus:ring-2 focus:ring-zencall-coral-100 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("auth.register.email")}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required placeholder={t("auth.register.emailPlaceholder")} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-zencall-coral-200 focus:ring-2 focus:ring-zencall-coral-100 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("auth.register.password")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required placeholder={t("auth.register.passwordPlaceholder")} minLength={8} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-zencall-coral-200 focus:ring-2 focus:ring-zencall-coral-100 outline-none" />
              </div>
            </div>

            {/* Legal Consent Checkboxes */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="consent-cgu"
                  checked={legalConsent.cgu}
                  onChange={(e) => setLegalConsent({ ...legalConsent, cgu: e.target.checked })}
                  className="mt-1 h-4 w-4 text-zencall-coral-600 focus:ring-zencall-coral-200 border-gray-300 rounded"
                  required
                />
                <label htmlFor="consent-cgu" className="ml-2 text-sm text-gray-700">
                  J'accepte les{' '}
                  <Link href="/legal/cgu" target="_blank" className="text-zencall-coral-600 hover:underline font-medium">
                    Conditions Générales d'Utilisation (CGU)
                  </Link>
                  <span className="text-red-500 ml-1">*</span>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="consent-cgv"
                  checked={legalConsent.cgv}
                  onChange={(e) => setLegalConsent({ ...legalConsent, cgv: e.target.checked })}
                  className="mt-1 h-4 w-4 text-zencall-coral-600 focus:ring-zencall-coral-200 border-gray-300 rounded"
                  required
                />
                <label htmlFor="consent-cgv" className="ml-2 text-sm text-gray-700">
                  J'accepte les{' '}
                  <Link href="/legal/cgv" target="_blank" className="text-zencall-coral-600 hover:underline font-medium">
                    Conditions Générales de Vente (CGV)
                  </Link>
                  <span className="text-red-500 ml-1">*</span>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="consent-privacy"
                  checked={legalConsent.privacy}
                  onChange={(e) => setLegalConsent({ ...legalConsent, privacy: e.target.checked })}
                  className="mt-1 h-4 w-4 text-zencall-coral-600 focus:ring-zencall-coral-200 border-gray-300 rounded"
                  required
                />
                <label htmlFor="consent-privacy" className="ml-2 text-sm text-gray-700">
                  J'accepte la{' '}
                  <Link href="/legal/privacy" target="_blank" className="text-zencall-coral-600 hover:underline font-medium">
                    Politique de Confidentialité
                  </Link>
                  <span className="text-red-500 ml-1">*</span>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="consent-marketing"
                  checked={legalConsent.marketing}
                  onChange={(e) => setLegalConsent({ ...legalConsent, marketing: e.target.checked })}
                  className="mt-1 h-4 w-4 text-zencall-coral-600 focus:ring-zencall-coral-200 border-gray-300 rounded"
                />
                <label htmlFor="consent-marketing" className="ml-2 text-sm text-gray-700">
                  J'accepte de recevoir des communications marketing par email (optionnel)
                </label>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                <span className="text-red-500">*</span> Champs obligatoires
              </p>
            </div>

            <button type="submit" disabled={isLoading || !isFormValid} className="w-full bg-zencall-coral-200 text-gray-800 py-2.5 rounded-xl font-medium hover:bg-zencall-coral-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("auth.register.submit")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {t("auth.register.haveAccount")} <Link href="/login" className="text-zencall-coral-600 hover:underline font-medium">{t("auth.register.signIn")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
