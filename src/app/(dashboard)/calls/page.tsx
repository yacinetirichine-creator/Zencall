"use client";

import Link from "next/link";
import { Header, PageHeader } from "@/components/layout";
import { Card, Badge, Spinner, EmptyState, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui";
import { useUser, useCalls } from "@/hooks";
import { formatDuration, formatRelativeTime, translateType, getStatusColor, formatPhone } from "@/lib/utils";
import { Phone, ArrowDownLeft, ArrowUpRight, Play, FileText } from "lucide-react";

export default function CallsPage() {
  const { organization, isLoading: userLoading } = useUser();
  const { calls, isLoading } = useCalls({ organizationId: organization?.id, limit: 100 });

  if (userLoading || isLoading) {
    return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
  }

  return (
    <>
      <Header breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Appels" }]} />
      <div className="p-6">
        <PageHeader title="Historique des appels" description="Consultez tous vos appels entrants et sortants" />

        {calls.length === 0 ? (
          <EmptyState 
            icon={<Phone className="w-16 h-16" />}
            title="Aucun appel"
            description="Les appels apparaîtront ici une fois que votre assistant sera configuré."
          />
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Direction</TableHead>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${call.direction === 'inbound' ? 'bg-zencall-blue-100' : 'bg-zencall-mint-100'}`}>
                        {call.direction === 'inbound' ? 
                          <ArrowDownLeft className="w-4 h-4 text-zencall-blue-600" /> : 
                          <ArrowUpRight className="w-4 h-4 text-zencall-mint-600" />
                        }
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatPhone(call.caller_number || call.recipient_number || "Inconnu")}</TableCell>
                    <TableCell>{formatDuration(call.duration_seconds)}</TableCell>
                    <TableCell><Badge className={getStatusColor(call.status)}>{translateType(call.status)}</Badge></TableCell>
                    <TableCell>
                      {call.sentiment && <Badge className={getStatusColor(call.sentiment)}>{translateType(call.sentiment)}</Badge>}
                    </TableCell>
                    <TableCell className="text-gray-500">{formatRelativeTime(call.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {call.recording_url && (
                          <a href={call.recording_url} target="_blank" className="p-1 hover:bg-gray-100 rounded">
                            <Play className="w-4 h-4 text-gray-500" />
                          </a>
                        )}
                        <Link href={`/dashboard/calls/${call.id}`} className="p-1 hover:bg-gray-100 rounded">
                          <FileText className="w-4 h-4 text-gray-500" />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </>
  );
}
