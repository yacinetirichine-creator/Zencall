"use client";

import { useState } from "react";
import { Header, PageHeader } from "@/components/layout";
import { Card, Badge, Spinner, EmptyState, Button, Modal, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui";
import { useUser, useContacts } from "@/hooks";
import { formatPhone, formatRelativeTime } from "@/lib/utils";
import { Users, Plus, Trash2, Edit, Upload } from "lucide-react";

export default function ContactsPage() {
  const { organization, isLoading: userLoading } = useUser();
  const { contacts, isLoading, createContact, deleteContact } = useContacts(organization?.id);
  const [showModal, setShowModal] = useState(false);
  const [newContact, setNewContact] = useState({ phone: "", first_name: "", last_name: "", email: "", company: "" });

  const handleCreate = async () => {
    await createContact({ ...newContact, tags: [] });
    setShowModal(false);
    setNewContact({ phone: "", first_name: "", last_name: "", email: "", company: "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce contact ?")) return;
    await deleteContact(id);
  };

  if (userLoading || isLoading) {
    return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
  }

  return (
    <>
      <Header breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Contacts" }]} />
      <div className="p-6">
        <PageHeader 
          title="Contacts" 
          description="Gérez votre base de contacts"
          actions={
            <div className="flex gap-2">
              <Button variant="outline"><Upload className="w-4 h-4 mr-1" /> Importer</Button>
              <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-1" /> Ajouter</Button>
            </div>
          }
        />

        {contacts.length === 0 ? (
          <EmptyState 
            icon={<Users className="w-16 h-16" />}
            title="Aucun contact"
            description="Ajoutez des contacts pour les utiliser dans vos campagnes."
            action={<Button onClick={() => setShowModal(true)}>Ajouter un contact</Button>}
          />
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Ajouté</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      {contact.first_name || contact.last_name 
                        ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
                        : '-'
                      }
                    </TableCell>
                    <TableCell>{formatPhone(contact.phone)}</TableCell>
                    <TableCell>{contact.email || '-'}</TableCell>
                    <TableCell>{contact.company || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {contact.tags.map((tag, i) => (
                          <Badge key={i} variant="gray">{tag}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">{formatRelativeTime(contact.created_at)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(contact.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouveau contact">
          <div className="space-y-4">
            <Input label="Téléphone" value={newContact.phone} onChange={(e) => setNewContact({...newContact, phone: e.target.value})} placeholder="+33612345678" required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Prénom" value={newContact.first_name} onChange={(e) => setNewContact({...newContact, first_name: e.target.value})} />
              <Input label="Nom" value={newContact.last_name} onChange={(e) => setNewContact({...newContact, last_name: e.target.value})} />
            </div>
            <Input label="Email" type="email" value={newContact.email} onChange={(e) => setNewContact({...newContact, email: e.target.value})} />
            <Input label="Entreprise" value={newContact.company} onChange={(e) => setNewContact({...newContact, company: e.target.value})} />
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowModal(false)}>Annuler</Button>
              <Button onClick={handleCreate}>Créer</Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
