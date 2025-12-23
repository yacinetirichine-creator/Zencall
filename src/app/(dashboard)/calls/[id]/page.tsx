"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardContent, Badge, Spinner } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { CallLog } from "@/types";
import { formatDuration, formatDate, translateType, getStatusColor, formatPhone } from "@/lib/utils";
import { Phone, Clock, MessageSquare, Play } from "lucide-react";

export default function CallDetailPage() {
  const params = useParams();
  const [call, setCall] = useState<CallLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCall = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("call_logs").select("*").eq("id", params.id).single();
      setCall(data);
      setIsLoading(false);
    };
    fetchCall();
  }, [params.id]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
  }

  if (!call) {
    return <div className="p-6">Appel non trouvé</div>;
  }

  return (
    <>
      <Header breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Appels", href: "/dashboard/calls" },
        { label: formatPhone(call.caller_number || "Détail") }
      ]} />
      <div className="p-6 max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-800">{formatPhone(call.caller_number || call.recipient_number || "Inconnu")}</h1>
            <p className="text-gray-500">{formatDate(call.created_at)}</p>
          </div>
          <Badge className={getStatusColor(call.status)}>{translateType(call.status)}</Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-zencall-blue-100 flex items-center justify-center">
                <Phone className="w-5 h-5 text-zencall-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Direction</p>
                <p className="font-medium">{call.direction === 'inbound' ? 'Entrant' : 'Sortant'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-zencall-mint-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-zencall-mint-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Durée</p>
                <p className="font-medium">{formatDuration(call.duration_seconds)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${call.sentiment ? getStatusColor(call.sentiment).split(' ')[0] : 'bg-gray-100'}`}>
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Sentiment</p>
                <p className="font-medium">{call.sentiment ? translateType(call.sentiment) : 'N/A'}</p>
              </div>
            </div>
          </Card>
        </div>

        {call.recording_url && (
          <Card>
            <CardHeader><CardTitle>Enregistrement</CardTitle></CardHeader>
            <CardContent>
              <audio controls className="w-full">
                <source src={call.recording_url} type="audio/mpeg" />
              </audio>
            </CardContent>
          </Card>
        )}

        {call.summary && (
          <Card>
            <CardHeader><CardTitle>Résumé</CardTitle></CardHeader>
            <CardContent>
              <p className="text-gray-700">{call.summary}</p>
            </CardContent>
          </Card>
        )}

        {call.transcript && (
          <Card>
            <CardHeader><CardTitle>Transcription</CardTitle></CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{call.transcript}</pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
