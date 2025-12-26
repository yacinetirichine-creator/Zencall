"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from "@/components/ui";
import { useUser } from "@/hooks";
import { Phone, MessageSquare, Calendar, Webhook, Plus, Trash2, CheckCircle, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function IntegrationsPage() {
  const { organization } = useUser();
  const [twilioConfig, setTwilioConfig] = useState({
    account_sid: "",
    auth_token: "",
    phone_number: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [twilioConfigured, setTwilioConfigured] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!organization?.id) return;

    const fetchConfig = async () => {
      const orgs = (supabase as any).from("organizations");
      const { data } = await orgs
        .select("twilio_account_sid, twilio_phone_number, twilio_configured")
        .eq("id", organization.id)
        .single();

      if (data) {
        setTwilioConfigured(data.twilio_configured || false);
        if (data.twilio_account_sid) {
          setTwilioConfig({
            account_sid: data.twilio_account_sid,
            auth_token: "••••••••••••••••", // Masqué
            phone_number: data.twilio_phone_number || "",
          });
        }
      }
    };

    fetchConfig();
  }, [organization?.id]);

  const saveTwilioConfig = async () => {
    if (!organization?.id) return;

    setIsSaving(true);
    try {
      const orgs = (supabase as any).from("organizations");
      const { error } = await orgs.update({
          twilio_account_sid: twilioConfig.account_sid,
          twilio_auth_token_encrypted: twilioConfig.auth_token, // TODO: Chiffrer en prod
          twilio_phone_number: twilioConfig.phone_number,
          twilio_configured: true,
        }).eq("id", organization.id);

      if (error) throw error;

      alert("Configuration Twilio sauvegardée !");
      setTwilioConfigured(true);
    } catch (error) {
      console.error("Erreur sauvegarde Twilio:", error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const testTwilio = async () => {
    try {
      const response = await fetch("/api/twilio/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organization_id: organization?.id }),
      });

      if (response.ok) {
        alert("Test réussi ! Twilio est bien configuré.");
      } else {
        alert("Test échoué. Vérifiez vos credentials.");
      }
    } catch (error) {
      alert("Erreur lors du test");
    }
  };

  const removeTwilioConfig = async () => {
    if (!confirm("Supprimer la configuration Twilio ?")) return;

    const orgs = (supabase as any).from("organizations");
    const { error } = await orgs.update({
        twilio_account_sid: null,
        twilio_auth_token_encrypted: null,
        twilio_phone_number: null,
        twilio_configured: false,
      }).eq("id", organization?.id);

    if (!error) {
      setTwilioConfig({ account_sid: "", auth_token: "", phone_number: "" });
      setTwilioConfigured(false);
      alert("Configuration supprimée");
    }
  };

  return (
    <>
      <Header breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Paramètres", href: "/dashboard/settings" },
        { label: "Intégrations" }
      ]} />

      <div className="p-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-gray-800">Intégrations</h1>
          <p className="text-gray-600 mt-1">
            Connectez vos outils pour étendre les fonctionnalités de Zencall
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* VAPI */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>VAPI</CardTitle>
                    <p className="text-sm text-gray-600">Téléphonie IA</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Actif
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Gestion des appels et assistants vocaux IA. Configuration globale déjà effectuée.
              </p>
              <Button variant="outline" size="sm" disabled>
                Configuré au niveau plateforme
              </Button>
            </CardContent>
          </Card>

          {/* Twilio SMS */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle>Twilio SMS</CardTitle>
                    <p className="text-sm text-gray-600">Envoi de SMS</p>
                  </div>
                </div>
                {twilioConfigured ? (
                  <Badge variant="mint">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Configuré
                  </Badge>
                ) : (
                  <Badge variant="gray">Non configuré</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Configurez votre propre compte Twilio pour envoyer des SMS de confirmation et rappels.
              </p>

              {!twilioConfigured ? (
                <>
                  <Input
                    label="Account SID"
                    value={twilioConfig.account_sid}
                    onChange={(e) => setTwilioConfig({ ...twilioConfig, account_sid: e.target.value })}
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  />

                  <Input
                    label="Auth Token"
                    type="password"
                    value={twilioConfig.auth_token}
                    onChange={(e) => setTwilioConfig({ ...twilioConfig, auth_token: e.target.value })}
                    placeholder="••••••••••••••••••••••••••••••"
                  />

                  <Input
                    label="Numéro de téléphone"
                    value={twilioConfig.phone_number}
                    onChange={(e) => setTwilioConfig({ ...twilioConfig, phone_number: e.target.value })}
                    placeholder="+33 6 12 34 56 78"
                  />

                  <div className="flex gap-2">
                    <Button onClick={saveTwilioConfig} isLoading={isSaving} size="sm">
                      Sauvegarder
                    </Button>
                    <Button variant="outline" size="sm">
                      <a href="https://www.twilio.com/try-twilio" target="_blank" rel="noopener noreferrer">
                        Créer un compte Twilio
                      </a>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-gray-600">SID:</span>{" "}
                    <span className="font-mono text-gray-800">{twilioConfig.account_sid}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Numéro:</span>{" "}
                    <span className="font-mono text-gray-800">{twilioConfig.phone_number}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={testTwilio}>
                      Tester la connexion
                    </Button>
                    <Button variant="outline" size="sm" onClick={removeTwilioConfig}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Google Calendar */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Google Calendar</CardTitle>
                    <p className="text-sm text-gray-600">Synchronisation RDV</p>
                  </div>
                </div>
                <Badge className="bg-gray-100 text-gray-700">Bientôt</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Synchronisez automatiquement vos rendez-vous avec Google Calendar.
              </p>
              <Button variant="outline" size="sm" disabled>
                Connecter Google Calendar
              </Button>
            </CardContent>
          </Card>

          {/* Webhooks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Webhook className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle>Webhooks</CardTitle>
                    <p className="text-sm text-gray-600">Notifications temps réel</p>
                  </div>
                </div>
                <Badge className="bg-gray-100 text-gray-700">0 webhook</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Recevez des notifications en temps réel pour les appels, RDV, etc.
              </p>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Ajouter un webhook
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Note :</strong> Chaque organisation configure ses propres intégrations tierces. 
            Vos credentials Twilio, Google, etc. ne sont jamais partagés avec d'autres organisations.
          </p>
        </div>
      </div>
    </>
  );
}
