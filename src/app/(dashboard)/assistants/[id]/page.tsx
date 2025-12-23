"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Textarea, Select, Switch, Spinner } from "@/components/ui";
import { useAssistant, useAssistants, useUser } from "@/hooks";
import { Loader2, Plus, Trash2 } from "lucide-react";

export default function AssistantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { organization } = useUser();
  const { assistant, isLoading } = useAssistant(id);
  const { updateAssistant } = useAssistants(organization?.id);
  
  const [formData, setFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [transferNumbers, setTransferNumbers] = useState<{name: string; number: string; priority: number}[]>([]);

  useEffect(() => {
    if (assistant) {
      setFormData({
        name: assistant.name,
        description: assistant.description || "",
        type: assistant.type,
        language: assistant.language,
        first_message: assistant.first_message || "",
        system_prompt: assistant.system_prompt || "",
        is_active: assistant.is_active,
      });
      setTransferNumbers(assistant.settings?.transfer_numbers || []);
    }
  }, [assistant]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateAssistant(id, {
      ...formData,
      settings: { ...assistant?.settings, transfer_numbers: transferNumbers }
    });
    setIsSaving(false);
  };

  const addTransferNumber = () => {
    setTransferNumbers([...transferNumbers, { name: "", number: "", priority: transferNumbers.length + 1 }]);
  };

  const removeTransferNumber = (index: number) => {
    setTransferNumbers(transferNumbers.filter((_, i) => i !== index));
  };

  if (isLoading || !formData) {
    return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
  }

  return (
    <>
      <Header breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Assistants", href: "/dashboard/assistants" },
        { label: assistant?.name || "Détail" }
      ]} />
      <div className="p-6 max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-gray-800">{formData.name}</h1>
          <div className="flex items-center gap-4">
            <Switch 
              checked={formData.is_active} 
              onChange={(checked) => setFormData({ ...formData, is_active: checked })}
              label={formData.is_active ? "Actif" : "Inactif"}
            />
            <Button onClick={handleSave} isLoading={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>Configuration générale</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input 
              label="Nom" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Textarea 
              label="Description" 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Select 
                label="Type" 
                options={[
                  { value: "astreinte", label: "Astreinte" },
                  { value: "rdv", label: "Prise de RDV" },
                  { value: "info", label: "Information" },
                  { value: "outbound", label: "Appels sortants" },
                ]} 
                value={formData.type} 
                onChange={(value) => setFormData({ ...formData, type: value })}
              />
              <Select 
                label="Langue" 
                options={[
                  { value: "fr", label: "Français" },
                  { value: "en", label: "Anglais" },
                  { value: "es", label: "Espagnol" },
                ]} 
                value={formData.language} 
                onChange={(value) => setFormData({ ...formData, language: value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Messages et instructions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input 
              label="Message d'accueil" 
              value={formData.first_message} 
              onChange={(e) => setFormData({ ...formData, first_message: e.target.value })}
            />
            <Textarea 
              label="Instructions système" 
              value={formData.system_prompt} 
              onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
              rows={10}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Numéros de transfert</CardTitle>
            <Button variant="outline" size="sm" onClick={addTransferNumber}>
              <Plus className="w-4 h-4 mr-1" /> Ajouter
            </Button>
          </CardHeader>
          <CardContent>
            {transferNumbers.length === 0 ? (
              <p className="text-sm text-gray-500">Aucun numéro de transfert configuré.</p>
            ) : (
              <div className="space-y-3">
                {transferNumbers.map((num, i) => (
                  <div key={i} className="flex gap-3 items-end">
                    <Input 
                      label={i === 0 ? "Nom" : undefined}
                      value={num.name} 
                      onChange={(e) => {
                        const updated = [...transferNumbers];
                        updated[i].name = e.target.value;
                        setTransferNumbers(updated);
                      }}
                      placeholder="Dr. Martin"
                    />
                    <Input 
                      label={i === 0 ? "Numéro" : undefined}
                      value={num.number} 
                      onChange={(e) => {
                        const updated = [...transferNumbers];
                        updated[i].number = e.target.value;
                        setTransferNumbers(updated);
                      }}
                      placeholder="+33612345678"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeTransferNumber(i)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
