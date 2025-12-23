"use client";

import { useState } from "react";
import { Header, PageHeader } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select, Avatar } from "@/components/ui";
import { useUser } from "@/hooks";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Save } from "lucide-react";

export default function SettingsPage() {
  const { profile, organization, refresh } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
  });
  const [orgData, setOrgData] = useState({
    name: organization?.name || "",
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").update(profileData).eq("id", profile?.id);
    await refresh();
    setIsSaving(false);
  };

  const handleSaveOrg = async () => {
    setIsSaving(true);
    const supabase = createClient();
    await supabase.from("organizations").update(orgData).eq("id", organization?.id);
    await refresh();
    setIsSaving(false);
  };

  return (
    <>
      <Header breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Paramètres" }]} />
      <div className="p-6 max-w-3xl space-y-6">
        <PageHeader title="Paramètres" description="Configurez votre compte et votre organisation" />

        <Card>
          <CardHeader><CardTitle>Profil</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar src={profile?.avatar_url} fallback={profile?.full_name || profile?.email} size="lg" />
              <div>
                <p className="font-medium text-gray-800">{profile?.email}</p>
                <p className="text-sm text-gray-500">{profile?.role === 'org_admin' ? 'Administrateur' : 'Utilisateur'}</p>
              </div>
            </div>
            <Input label="Nom complet" value={profileData.full_name} onChange={(e) => setProfileData({...profileData, full_name: e.target.value})} />
            <Input label="Téléphone" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} placeholder="+33612345678" />
            <Button onClick={handleSaveProfile} isLoading={isSaving}><Save className="w-4 h-4 mr-1" /> Enregistrer</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Organisation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Nom de l'organisation" value={orgData.name} onChange={(e) => setOrgData({...orgData, name: e.target.value})} />
            <Button onClick={handleSaveOrg} isLoading={isSaving}><Save className="w-4 h-4 mr-1" /> Enregistrer</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Sécurité</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">Changer le mot de passe</Button>
            <Button variant="danger">Supprimer mon compte</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
