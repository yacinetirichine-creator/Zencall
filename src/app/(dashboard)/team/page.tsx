"use client";

import { useState, useEffect } from "react";
import { Header, PageHeader } from "@/components/layout";
import { Card, Badge, Spinner, EmptyState, Button, Modal, Input, Select, Avatar, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui";
import { useUser } from "@/hooks";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types";
import { Users, Plus, Trash2, Mail } from "lucide-react";

export default function TeamPage() {
  const { organization, profile, isLoading: userLoading } = useUser();
  const [members, setMembers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("user");

  useEffect(() => {
    if (!organization?.id) return;
    const fetchMembers = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("profiles").select("*").eq("organization_id", organization.id);
      setMembers(data || []);
      setIsLoading(false);
    };
    fetchMembers();
  }, [organization?.id]);

  const handleInvite = async () => {
    // In real app, send invitation email
    alert(`Invitation envoyée à ${inviteEmail}`);
    setShowModal(false);
    setInviteEmail("");
  };

  if (userLoading || isLoading) {
    return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
  }

  return (
    <>
      <Header breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Équipe" }]} />
      <div className="p-6">
        <PageHeader 
          title="Équipe" 
          description="Gérez les membres de votre organisation"
          actions={<Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-1" /> Inviter</Button>}
        />

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Ajouté</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={member.avatar_url} fallback={member.full_name || member.email} size="sm" />
                      <span className="font-medium">{member.full_name || "Sans nom"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={member.role === 'org_admin' ? 'coral' : 'gray'}>
                      {member.role === 'org_admin' ? 'Admin' : 'Utilisateur'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(member.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    {member.id !== profile?.id && (
                      <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Inviter un membre">
          <div className="space-y-4">
            <Input label="Email" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="collegue@exemple.com" leftIcon={<Mail className="w-4 h-4" />} />
            <Select label="Rôle" options={[{ value: "user", label: "Utilisateur" }, { value: "org_admin", label: "Administrateur" }]} value={inviteRole} onChange={setInviteRole} />
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowModal(false)}>Annuler</Button>
              <Button onClick={handleInvite}>Envoyer l'invitation</Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
