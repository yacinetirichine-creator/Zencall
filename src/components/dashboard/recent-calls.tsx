"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";
import { CallLog } from "@/types";
import { formatDuration, formatRelativeTime, translateType, getStatusColor, formatPhone } from "@/lib/utils";
import { Phone, ArrowRight } from "lucide-react";

interface RecentCallsProps {
  calls: CallLog[];
}

export function RecentCalls({ calls }: RecentCallsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Appels récents</CardTitle>
        <Link href="/dashboard/calls" className="text-sm text-zencall-coral-600 hover:underline flex items-center gap-1">
          Voir tout <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-50">
          {calls.slice(0, 5).map((call) => (
            <div key={call.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${call.direction === "inbound" ? "bg-zencall-blue-100" : "bg-zencall-mint-100"}`}>
                  <Phone className={`w-5 h-5 ${call.direction === "inbound" ? "text-zencall-blue-600" : "text-zencall-mint-600"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{formatPhone(call.caller_number || call.recipient_number || "Inconnu")}</p>
                  <p className="text-xs text-gray-500">{formatRelativeTime(call.created_at)} • {formatDuration(call.duration_seconds)}</p>
                </div>
              </div>
              <Badge className={getStatusColor(call.status)}>{translateType(call.status)}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
