"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Textarea, Select } from "@/components/ui";
import { useUser, useAssistants } from "@/hooks";
import { Loader2 } from "lucide-react";

const assistantTypes = [
  { value: "astreinte", label: "Astreinte / Urgences" },
  { value: "rdv", label: "Prise de rendez-vous" },
  { value: "info", label: "Information client" },
  { value: "outbound", label: "Appels sortants" },
];

const languages = [
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
  { value: "es", label: "Espagnol" },
  { value: "nl", label: "Néerlandais" },
  { value: "ar", label: "Arabe marocain" },
];

export default function NewAssistantPage() {
  const router = useRouter();
  const { organization } = useUser();
  const { createAssistant } = useAssistants(organization?.id);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "info",
    language: "fr",
    first_message: "Bonjour, comment puis-je vous aider ?",
    system_prompt: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const created = (await createAssistant({
        ...formData,
        type: formData.type as any,
        language: formData.language as any,
        is_active: true,
        settings: {},
      })) as unknown as { id?: string } | null;

      if (created?.id) {
        router.push(`/dashboard/assistants/${created.id}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const defaultPrompts: Record<string, string> = {
    astreinte: `Tu es un assistant d'astreinte téléphonique. Tu dois :
1. Identifier l'urgence de l'appel
2. Collecter les informations nécessaires (nom, numéro, nature du problème)
3. Transférer les appels urgents au numéro d'astreinte
4. Prendre un message pour les demandes non urgentes`,
    rdv: `Tu es un assistant de prise de rendez-vous. Tu dois :
1. Demander le motif du rendez-vous
2. Proposer les créneaux disponibles
3. Confirmer le rendez-vous avec les détails (date, heure, lieu)
4. Envoyer un rappel par SMS`,
    info: `Tu es un assistant d'information client. Tu dois :
1. Répondre aux questions fréquentes
2. Orienter vers le bon service si nécessaire
3. Prendre un message si tu ne peux pas répondre`,
    outbound: `Tu es un assistant pour des appels sortants. Tu dois :
1. Te présenter clairement
2. Expliquer l'objet de l'appel
3. Collecter les informations demandées
4. Remercier et conclure poliment`,
  };

  return (
    <>
      <Header breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Assistants", href: "/dashboard/assistants" },
        { label: "Nouvel assistant" }
      ]} />
      <div className="p-6 max-w-3xl">
        <h1 className="text-2xl font-display font-bold text-gray-800 mb-6">Créer un assistant</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Informations générales</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input 
                label="Nom de l'assistant" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Assistant Cabinet Médical"
                required
              />
              <Textarea 
                label="Description" 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description de l'assistant..."
                rows={2}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <Select 
                  label="Type d'assistant" 
                  options={assistantTypes} 
                  value={formData.type} 
                  onChange={(value) => setFormData({ 
                    ...formData, 
                    type: value,
                    system_prompt: defaultPrompts[value] || ""
                  })}
                />
                <Select 
                  label="Langue" 
                  options={languages} 
                  value={formData.language} 
                  onChange={(value) => setFormData({ ...formData, language: value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Configuration vocale</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input 
                label="Message d'accueil" 
                value={formData.first_message} 
                onChange={(e) => setFormData({ ...formData, first_message: e.target.value })}
                placeholder="Bonjour, comment puis-je vous aider ?"
              />
              <Textarea 
                label="Instructions système (prompt)" 
                value={formData.system_prompt} 
                onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                placeholder="Instructions pour l'IA..."
                rows={8}
              />
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
            <Button type="submit" isLoading={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Créer l'assistant"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
