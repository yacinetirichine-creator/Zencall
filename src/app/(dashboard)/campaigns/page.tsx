"use client";

import Link from "next/link";
import { Header, PageHeader } from "@/components/layout";
import { Card, Badge, Spinner, EmptyState, Button } from "@/components/ui";
import { useUser, useCampaigns } from "@/hooks";
import { translateType, getStatusColor, formatRelativeTime } from "@/lib/utils";
import { Megaphone, Plus, Play, Pause, BarChart3 } from "lucide-react";

export default function CampaignsPage() {
  const { organization, isLoading: userLoading } = useUser();
  const { campaigns, isLoading } = useCampaigns(organization?.id);

  if (userLoading || isLoading) {
    return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
  }

  return (
    <>
      <Header breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Campagnes" }]} />
      <div className="p-6">
        <PageHeader 
          title="Campagnes" 
          description="Gérez vos campagnes d'appels sortants"
          actions={<Link href="/dashboard/campaigns/new"><Button><Plus className="w-4 h-4 mr-1" /> Nouvelle campagne</Button></Link>}
        />

        {campaigns.length === 0 ? (
          <EmptyState 
            icon={<Megaphone className="w-16 h-16" />}
            title="Aucune campagne"
            description="Créez une campagne pour lancer des appels sortants automatisés."
            action={<Link href="/dashboard/campaigns/new"><Button>Créer une campagne</Button></Link>}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge className={getStatusColor(campaign.status)}>{translateType(campaign.status)}</Badge>
                  {campaign.status === 'running' ? (
                    <Button variant="ghost" size="icon"><Pause className="w-4 h-4" /></Button>
                  ) : campaign.status === 'draft' || campaign.status === 'paused' ? (
                    <Button variant="ghost" size="icon"><Play className="w-4 h-4" /></Button>
                  ) : null}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{campaign.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{campaign.description || translateType(campaign.type)}</p>
                
                <div className="grid grid-cols-2 gap-2 text-center mb-4">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-gray-800">{campaign.stats.calls_made}</p>
                    <p className="text-xs text-gray-500">Appels</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-zencall-mint-600">{campaign.stats.success_rate}%</p>
                    <p className="text-xs text-gray-500">Succès</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{formatRelativeTime(campaign.created_at)}</span>
                  <Link href={`/dashboard/campaigns/${campaign.id}`} className="text-zencall-coral-600 hover:underline flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" /> Détails
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
