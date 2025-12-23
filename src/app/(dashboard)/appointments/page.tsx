"use client";

import { Header, PageHeader } from "@/components/layout";
import { Card, Badge, Spinner, EmptyState, Button, Modal, Input, Textarea, Select } from "@/components/ui";
import { useUser, useAppointments } from "@/hooks";
import { formatDate, translateType, getStatusColor } from "@/lib/utils";
import { Calendar, Plus, Clock, User } from "lucide-react";
import { useState } from "react";

export default function AppointmentsPage() {
  const { organization, isLoading: userLoading } = useUser();
  const { appointments, isLoading, createAppointment, updateAppointment } = useAppointments(organization?.id);
  const [showModal, setShowModal] = useState(false);
  const [newAppt, setNewAppt] = useState({ title: "", description: "", start_time: "", end_time: "", status: "scheduled" });

  const handleCreate = async () => {
    await createAppointment(newAppt as any);
    setShowModal(false);
    setNewAppt({ title: "", description: "", start_time: "", end_time: "", status: "scheduled" });
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateAppointment(id, { status: status as any });
  };

  if (userLoading || isLoading) {
    return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingAppointments = appointments.filter(a => new Date(a.start_time) >= today && a.status !== 'cancelled');
  const pastAppointments = appointments.filter(a => new Date(a.start_time) < today || a.status === 'cancelled');

  return (
    <>
      <Header breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Rendez-vous" }]} />
      <div className="p-6">
        <PageHeader 
          title="Rendez-vous" 
          description="Gérez vos rendez-vous pris par l'assistant"
          actions={<Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-1" /> Nouveau RDV</Button>}
        />

        {appointments.length === 0 ? (
          <EmptyState 
            icon={<Calendar className="w-16 h-16" />}
            title="Aucun rendez-vous"
            description="Les rendez-vous pris par votre assistant apparaîtront ici."
          />
        ) : (
          <div className="space-y-6">
            {upcomingAppointments.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">À venir ({upcomingAppointments.length})</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingAppointments.map((appt) => (
                    <Card key={appt.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={getStatusColor(appt.status)}>{translateType(appt.status)}</Badge>
                        <select 
                          value={appt.status} 
                          onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="scheduled">Planifié</option>
                          <option value="confirmed">Confirmé</option>
                          <option value="cancelled">Annulé</option>
                          <option value="completed">Terminé</option>
                        </select>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">{appt.title}</h3>
                      {appt.description && <p className="text-sm text-gray-500 mb-3">{appt.description}</p>}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {new Date(appt.start_time).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {pastAppointments.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Passés ({pastAppointments.length})</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
                  {pastAppointments.slice(0, 6).map((appt) => (
                    <Card key={appt.id} className="p-4">
                      <Badge className={getStatusColor(appt.status)}>{translateType(appt.status)}</Badge>
                      <h3 className="font-semibold text-gray-800 mt-2">{appt.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(appt.start_time)}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouveau rendez-vous">
          <div className="space-y-4">
            <Input label="Titre" value={newAppt.title} onChange={(e) => setNewAppt({...newAppt, title: e.target.value})} required />
            <Textarea label="Description" value={newAppt.description} onChange={(e) => setNewAppt({...newAppt, description: e.target.value})} rows={2} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Début" type="datetime-local" value={newAppt.start_time} onChange={(e) => setNewAppt({...newAppt, start_time: e.target.value})} required />
              <Input label="Fin" type="datetime-local" value={newAppt.end_time} onChange={(e) => setNewAppt({...newAppt, end_time: e.target.value})} required />
            </div>
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
