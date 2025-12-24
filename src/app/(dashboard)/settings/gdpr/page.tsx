"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from "@/components/ui";
import { useUser } from "@/hooks";
import { Shield, Download, Trash2, Eye, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function GDPRPage() {
  const { profile, organization } = useUser();
  const [requests, setRequests] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (!profile?.id) return;
    
    const fetchRequests = async () => {
      const { data } = await supabase
        .from("gdpr_requests")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });
      
      setRequests(data || []);
    };

    fetchRequests();
  }, [profile?.id]);

  const createDataRequest = async (type: string) => {
    if (!confirm(`Confirmer la demande de ${type === "data_export" ? "téléchargement" : "suppression"} de vos données ?`)) {
      return;
    }

    const { error } = await supabase.from("gdpr_requests").insert({
      user_id: profile?.id,
      organization_id: organization?.id,
      request_type: type,
      status: "pending",
    });

    if (!error) {
      alert("Demande enregistrée. Vous recevrez un email sous 30 jours.");
      window.location.reload();
    }
  };

  const statusColors: Record<string, string> = {
    pending: "yellow",
    processing: "blue",
    completed: "green",
    rejected: "red",
  };

  const statusLabels: Record<string, string> = {
    pending: "En attente",
    processing: "En cours",
    completed: "Terminée",
    rejected: "Rejetée",
  };

  return (
    <>
      <Header breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Paramètres", href: "/dashboard/settings" },
        { label: "Données personnelles (RGPD)" }
      ]} />
      
      <div className="p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-gray-800 flex items-center gap-2">
            <Shield className="w-7 h-7 text-zencall-coral-600" />
            Mes données personnelles
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez vos données conformément au RGPD
          </p>
        </div>

        {/* Vos droits */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Vos droits RGPD</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Eye className="w-5 h-5 text-zencall-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Droit d'accès</h3>
                    <p className="text-sm text-gray-600">
                      Consultez toutes les données que nous détenons sur vous
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Voir mes données
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Download className="w-5 h-5 text-zencall-mint-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Droit à la portabilité</h3>
                    <p className="text-sm text-gray-600">
                      Exportez vos données dans un format réutilisable
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => createDataRequest("data_export")}
                >
                  Télécharger mes données
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <FileText className="w-5 h-5 text-zencall-lavender-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Droit de rectification</h3>
                    <p className="text-sm text-gray-600">
                      Corrigez ou mettez à jour vos informations
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Modifier mes infos
                </Button>
              </div>

              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-start gap-3 mb-3">
                  <Trash2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Droit à l'effacement</h3>
                    <p className="text-sm text-gray-600">
                      Supprimez définitivement votre compte et données
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-red-300 text-red-700 hover:bg-red-100"
                  onClick={() => createDataRequest("data_deletion")}
                >
                  Supprimer mon compte
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historique des demandes */}
        <Card>
          <CardHeader>
            <CardTitle>Historique de mes demandes</CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucune demande RGPD</p>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">
                        {request.request_type === "data_export" ? "Export de données" : "Suppression de compte"}
                      </span>
                      <Badge className={`bg-${statusColors[request.status]}-100 text-${statusColors[request.status]}-700`}>
                        {statusLabels[request.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Demandé le {new Date(request.created_at).toLocaleDateString("fr-FR")}
                    </p>
                    {request.data_url && (
                      <a 
                        href={request.data_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-zencall-coral-600 hover:underline mt-2 inline-block"
                      >
                        Télécharger mes données
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Délai de traitement :</strong> Nous traitons vos demandes sous 30 jours conformément au RGPD.
            Pour toute question, contactez-nous à{" "}
            <a href="mailto:privacy@zencall.fr" className="text-zencall-coral-600 hover:underline">
              privacy@zencall.fr
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
