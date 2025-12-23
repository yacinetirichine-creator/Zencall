"use client";

import Link from "next/link";
import { Header, PageHeader } from "@/components/layout";
import { Card, Button, Badge, EmptyState, Spinner, Switch } from "@/components/ui";
import { useUser, useAssistants } from "@/hooks";
import { translateType } from "@/lib/utils";
import { Bot, Plus, Phone, Calendar, Info, Megaphone, Settings, Trash2 } from "lucide-react";
import { useState } from "react";

const typeIcons: Record<string, React.ComponentType<{className?: string}>> = {
  astreinte: Phone,
  rdv: Calendar,
  info: Info,
  outbound: Megaphone,
};

export default function AssistantsPage() {
  const { organization, isLoading: userLoading } = useUser();
  const { assistants, isLoading, updateAssistant, deleteAssistant } = useAssistants(organization?.id);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleToggle = async (id: string, isActive: boolean) => {
    await updateAssistant(id, { is_active: isActive });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet assistant ?")) return;
    setDeleting(id);
    await deleteAssistant(id);
    setDeleting(null);
  };

  if (userLoading || isLoading) {
    return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
  }

  return (
    <>
      <Header breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Assistants" }]} />
      <div className="p-6">
        <PageHeader 
          title="Assistants" 
          description="Gérez vos assistants vocaux IA"
          actions={
            <Link href="/dashboard/assistants/new">
              <Button leftIcon={<Plus className="w-4 h-4" />}>Nouvel assistant</Button>
            </Link>
          }
        />

        {assistants.length === 0 ? (
          <EmptyState 
            icon={<Bot className="w-16 h-16" />}
            title="Aucun assistant"
            description="Créez votre premier assistant vocal pour commencer à recevoir des appels."
            action={<Link href="/dashboard/assistants/new"><Button>Créer un assistant</Button></Link>}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assistants.map((assistant) => {
              const TypeIcon = typeIcons[assistant.type] || Bot;
              return (
                <Card key={assistant.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${assistant.is_active ? 'bg-zencall-mint-100' : 'bg-gray-100'}`}>
                      <TypeIcon className={`w-6 h-6 ${assistant.is_active ? 'text-zencall-mint-600' : 'text-gray-400'}`} />
                    </div>
                    <Switch checked={assistant.is_active} onChange={(checked) => handleToggle(assistant.id, checked)} />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{assistant.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{assistant.description || "Aucune description"}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="blue">{translateType(assistant.type)}</Badge>
                    <Badge>{translateType(assistant.language)}</Badge>
                  </div>
                  {assistant.phone_number && (
                    <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {assistant.phone_number}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Link href={`/dashboard/assistants/${assistant.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Settings className="w-4 h-4" /> Configurer
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(assistant.id)}
                      disabled={deleting === assistant.id}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
