-- =============================================
-- DONNÉES DE TEST POUR ZENCALL
-- =============================================
-- À exécuter après le schéma principal

-- =============================================
-- 1. ORGANISATION DE TEST
-- =============================================

INSERT INTO organizations (id, name, slug, plan, billing_email, phone, monthly_call_limit, monthly_calls_used, assistant_limit, user_limit)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Demo Company', 'demo-company', 'pro', 'demo@zencall.com', '+33123456789', 1000, 45, 5, 10);

-- =============================================
-- 2. UTILISATEUR DE TEST
-- =============================================
-- Note: Créer d'abord un utilisateur via l'interface Supabase Auth
-- Ensuite, mettre à jour le profil avec cet ID

-- Exemple de mise à jour (remplacer USER_ID par l'UUID réel de auth.users)
-- UPDATE profiles 
-- SET organization_id = '00000000-0000-0000-0000-000000000001', 
--     role = 'org_admin'
-- WHERE id = 'USER_ID';

-- =============================================
-- 3. ASSISTANTS DE DÉMONSTRATION
-- =============================================

INSERT INTO assistants (
  id, 
  organization_id, 
  name, 
  description, 
  type, 
  language, 
  system_prompt, 
  first_message,
  is_active,
  max_duration_seconds,
  total_calls,
  total_minutes
) VALUES 
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Assistant Accueil',
    'Assistant pour l''accueil et l''information générale',
    'info',
    'fr',
    'Tu es un assistant téléphonique professionnel et courtois. Ton rôle est d''accueillir les appelants et de répondre à leurs questions.',
    'Bonjour ! Merci d''avoir appelé. Comment puis-je vous aider aujourd''hui ?',
    true,
    600,
    127,
    856
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Assistant Rendez-vous',
    'Gestion et prise de rendez-vous',
    'rdv',
    'fr',
    'Tu es spécialisé dans la prise de rendez-vous. Sois efficace et confirme tous les détails avec l''appelant.',
    'Bonjour ! Je peux vous aider à planifier un rendez-vous. Quand souhaitez-vous venir ?',
    true,
    300,
    89,
    445
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Assistant Support',
    'Support client et assistance technique',
    'astreinte',
    'fr',
    'Tu es un assistant de support technique. Aide les clients avec leurs problèmes de manière claire et pédagogique.',
    'Bonjour, support technique à votre écoute. Quel est votre problème ?',
    true,
    900,
    56,
    672
  );

-- =============================================
-- 4. CONTACTS DE DÉMONSTRATION
-- =============================================

INSERT INTO contacts (
  organization_id,
  phone,
  first_name,
  last_name,
  email,
  company,
  tags,
  opted_in_sms,
  opted_in_email,
  total_calls
) VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    '+33612345678',
    'Marie',
    'Dupont',
    'marie.dupont@example.com',
    'Tech Solutions',
    ARRAY['client', 'premium'],
    true,
    true,
    5
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '+33687654321',
    'Jean',
    'Martin',
    'jean.martin@example.com',
    'Digital Agency',
    ARRAY['prospect'],
    true,
    true,
    2
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '+33623456789',
    'Sophie',
    'Bernard',
    'sophie.bernard@example.com',
    'Startup Inc',
    ARRAY['client'],
    true,
    false,
    8
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '+33698765432',
    'Pierre',
    'Dubois',
    'pierre.dubois@example.com',
    null,
    ARRAY['prospect', 'lead'],
    false,
    true,
    1
  );

-- =============================================
-- 5. APPELS DE DÉMONSTRATION
-- =============================================

INSERT INTO call_logs (
  organization_id,
  assistant_id,
  contact_id,
  direction,
  caller_number,
  recipient_number,
  status,
  duration_seconds,
  transcript,
  summary,
  sentiment,
  cost,
  started_at,
  ended_at,
  created_at
) VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    (SELECT id FROM contacts WHERE phone = '+33612345678' LIMIT 1),
    'inbound',
    '+33612345678',
    '+33123456789',
    'completed',
    185,
    'Bonjour ! Merci d''avoir appelé. Comment puis-je vous aider aujourd''hui ? - Bonjour, je souhaite des informations sur vos services...',
    'Client demandant des informations sur les services. Informations fournies avec succès.',
    'positive',
    0.25,
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours' + INTERVAL '185 seconds',
    NOW() - INTERVAL '2 hours'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    (SELECT id FROM contacts WHERE phone = '+33687654321' LIMIT 1),
    'inbound',
    '+33687654321',
    '+33123456789',
    'completed',
    142,
    'Bonjour ! Je peux vous aider à planifier un rendez-vous...',
    'Rendez-vous pris pour le client le 28 décembre à 14h00.',
    'positive',
    0.19,
    NOW() - INTERVAL '5 hours',
    NOW() - INTERVAL '5 hours' + INTERVAL '142 seconds',
    NOW() - INTERVAL '5 hours'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000003',
    (SELECT id FROM contacts WHERE phone = '+33623456789' LIMIT 1),
    'inbound',
    '+33623456789',
    '+33123456789',
    'completed',
    423,
    'Bonjour, support technique à votre écoute...',
    'Problème technique résolu avec succès. Client satisfait.',
    'positive',
    0.58,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day' + INTERVAL '423 seconds',
    NOW() - INTERVAL '1 day'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    (SELECT id FROM contacts WHERE phone = '+33698765432' LIMIT 1),
    'outbound',
    '+33123456789',
    '+33698765432',
    'missed',
    0,
    null,
    'Pas de réponse',
    'neutral',
    0.05,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
  );

-- =============================================
-- 6. RENDEZ-VOUS DE DÉMONSTRATION
-- =============================================

INSERT INTO appointments (
  organization_id,
  assistant_id,
  contact_id,
  title,
  description,
  start_time,
  end_time,
  status,
  location,
  location_type
) VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    (SELECT id FROM contacts WHERE phone = '+33687654321' LIMIT 1),
    'Consultation initiale',
    'Première consultation pour discuter des besoins',
    NOW() + INTERVAL '5 days',
    NOW() + INTERVAL '5 days' + INTERVAL '1 hour',
    'scheduled',
    'Bureau principal',
    'office'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    (SELECT id FROM contacts WHERE phone = '+33612345678' LIMIT 1),
    'Suivi projet',
    'Point d''avancement sur le projet en cours',
    NOW() + INTERVAL '2 days',
    NOW() + INTERVAL '2 days' + INTERVAL '30 minutes',
    'confirmed',
    'Visioconférence',
    'video'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    (SELECT id FROM contacts WHERE phone = '+33623456789' LIMIT 1),
    'Démonstration produit',
    'Démonstration complète de nos solutions',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days' + INTERVAL '45 minutes',
    'completed',
    'En ligne',
    'video'
  );

-- =============================================
-- 7. CAMPAGNE DE DÉMONSTRATION
-- =============================================

INSERT INTO campaigns (
  organization_id,
  assistant_id,
  name,
  description,
  type,
  status,
  scheduled_at,
  settings,
  stats
) VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Relance clients Q4 2024',
    'Campagne de relance des clients pour fin d''année',
    'reminder',
    'completed',
    NOW() - INTERVAL '7 days',
    '{"max_attempts": 3, "concurrent_calls": 5, "retry_delay_minutes": 120, "call_window_start": "09:00", "call_window_end": "18:00"}'::jsonb,
    '{"total_contacts": 50, "calls_made": 48, "calls_answered": 42, "calls_failed": 6, "calls_completed": 42, "success_rate": 87.5, "avg_duration": 165, "total_cost": 12.50}'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    'Prise RDV Janvier 2025',
    'Planification des rendez-vous pour janvier',
    'custom',
    'scheduled',
    NOW() + INTERVAL '3 days',
    '{"max_attempts": 2, "concurrent_calls": 3, "retry_delay_minutes": 60, "call_window_start": "10:00", "call_window_end": "17:00"}'::jsonb,
    '{"total_contacts": 30, "calls_made": 0, "calls_answered": 0, "calls_failed": 0, "calls_completed": 0, "success_rate": 0, "avg_duration": 0, "total_cost": 0}'::jsonb
  );

-- =============================================
-- 8. ABONNEMENT DE DÉMONSTRATION
-- =============================================

INSERT INTO subscriptions (
  organization_id,
  plan,
  status,
  current_period_start,
  current_period_end,
  amount,
  currency,
  billing_interval,
  trial_end
) VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    'pro',
    'active',
    DATE_TRUNC('month', NOW()),
    DATE_TRUNC('month', NOW()) + INTERVAL '1 month',
    79.00,
    'EUR',
    'monthly',
    NOW() + INTERVAL '14 days'
  );

-- =============================================
-- 9. MÉTRIQUES D'UTILISATION
-- =============================================

INSERT INTO usage_metrics (
  organization_id,
  period_start,
  period_end,
  total_calls,
  inbound_calls,
  outbound_calls,
  total_minutes,
  total_cost,
  avg_duration_seconds,
  success_rate,
  assistants_used,
  appointments_created
) VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    DATE_TRUNC('month', NOW()),
    DATE_TRUNC('month', NOW()) + INTERVAL '1 month',
    272,
    198,
    74,
    3847,
    68.45,
    143,
    82.35,
    3,
    23
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    DATE_TRUNC('month', NOW() - INTERVAL '1 month'),
    DATE_TRUNC('month', NOW()),
    315,
    235,
    80,
    4256,
    78.92,
    136,
    84.76,
    3,
    28
  );

-- =============================================
-- 10. NOTIFICATIONS
-- =============================================

INSERT INTO notifications (
  organization_id,
  type,
  title,
  message,
  status,
  sent_at
) VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    'email',
    'Nouveau rendez-vous confirmé',
    'Un nouveau rendez-vous a été confirmé pour le 28 décembre à 14h00.',
    'delivered',
    NOW() - INTERVAL '5 hours'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'email',
    'Rapport mensuel disponible',
    'Votre rapport d''activité pour le mois est maintenant disponible.',
    'delivered',
    NOW() - INTERVAL '2 days'
  );

-- =============================================
-- FIN DES DONNÉES DE TEST
-- =============================================

-- Vérification des données insérées
SELECT 'Organizations:' as table_name, COUNT(*) as count FROM organizations WHERE id = '00000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'Assistants:', COUNT(*) FROM assistants WHERE organization_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'Contacts:', COUNT(*) FROM contacts WHERE organization_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'Call Logs:', COUNT(*) FROM call_logs WHERE organization_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'Appointments:', COUNT(*) FROM appointments WHERE organization_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'Campaigns:', COUNT(*) FROM campaigns WHERE organization_id = '00000000-0000-0000-0000-000000000001';
