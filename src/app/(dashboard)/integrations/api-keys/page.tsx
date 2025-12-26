"use client";

import { useState, useEffect } from "react";
import { Header, PageHeader } from "@/components/layout";
import { Card, Button, Modal, Input, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, EmptyState } from "@/components/ui";
import { useUser } from "@/hooks";
import { createClient } from "@/lib/supabase/client";
import { ApiKey } from "@/types";
import { generateApiKey, formatRelativeTime } from "@/lib/utils";
import { Key, Plus, Copy, Trash2, Check } from "lucide-react";

export default function ApiKeysPage() {
  const { organization } = useUser();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!organization?.id) return;
    const fetchKeys = async () => {
      const supabase = createClient();
      const apiKeys = (supabase as any).from("api_keys");
      const { data } = await apiKeys.select("*").eq("organization_id", organization.id);
      setKeys(data || []);
    };
    fetchKeys();
  }, [organization?.id]);

  const handleCreate = async () => {
    const key = generateApiKey();
    const supabase = createClient();
    const apiKeys = (supabase as any).from("api_keys");
    const { data } = await apiKeys.insert({
      organization_id: organization?.id,
      name: newKeyName,
      key_hash: btoa(key), // In real app, use proper hashing
      key_prefix: key.slice(0, 10),
      permissions: ["read", "write"],
      is_active: true,
    }).select().single();
    
    if (data) {
      setKeys([...keys, data]);
      setGeneratedKey(key);
    }
  };

  const handleCopy = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette clé API ?")) return;
    const supabase = createClient();
    const apiKeys = (supabase as any).from("api_keys");
    await apiKeys.delete().eq("id", id);
    setKeys(keys.filter(k => k.id !== id));
  };

  const closeModal = () => {
    setShowModal(false);
    setNewKeyName("");
    setGeneratedKey(null);
  };

  return (
    <>
      <Header breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Intégrations", href: "/dashboard/integrations" }, { label: "Clés API" }]} />
      <div className="p-6">
        <PageHeader title="Clés API" description="Gérez vos clés d'accès à l'API REST" actions={<Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-1" /> Nouvelle clé</Button>} />

        {keys.length === 0 ? (
          <EmptyState icon={<Key className="w-16 h-16" />} title="Aucune clé API" description="Créez une clé pour accéder à l'API." action={<Button onClick={() => setShowModal(true)}>Créer une clé</Button>} />
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Clé</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière utilisation</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell><code className="text-sm bg-gray-100 px-2 py-1 rounded">{key.key_prefix}...</code></TableCell>
                    <TableCell><Badge variant={key.is_active ? "mint" : "gray"}>{key.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                    <TableCell className="text-gray-500">{key.last_used_at ? formatRelativeTime(key.last_used_at) : "Jamais"}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={() => handleDelete(key.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        <Modal isOpen={showModal} onClose={closeModal} title={generatedKey ? "Clé créée" : "Nouvelle clé API"}>
          {generatedKey ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Copiez cette clé maintenant. Elle ne sera plus affichée.</p>
              <div className="flex gap-2">
                <code className="flex-1 bg-gray-100 p-3 rounded-lg text-sm break-all">{generatedKey}</code>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <Button className="w-full" onClick={closeModal}>Fermer</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input label="Nom de la clé" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="Production API" />
              <div className="flex gap-3">
                <Button variant="outline" onClick={closeModal}>Annuler</Button>
                <Button onClick={handleCreate} disabled={!newKeyName}>Créer</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
