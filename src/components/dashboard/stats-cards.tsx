"use client";

import { Card } from "@/components/ui";
import { Phone, Clock, TrendingUp, Calendar } from "lucide-react";

interface StatsCardsProps {
  totalCalls: number;
  totalMinutes: number;
  successRate: number;
  appointmentsToday: number;
}

export function StatsCards({ totalCalls, totalMinutes, successRate, appointmentsToday }: StatsCardsProps) {
  const stats = [
    { label: "Appels (7j)", value: totalCalls, icon: Phone, color: "bg-zencall-coral-100 text-zencall-coral-600" },
    { label: "Minutes", value: totalMinutes, icon: Clock, color: "bg-zencall-blue-100 text-zencall-blue-600" },
    { label: "Taux de réussite", value: `${successRate}%`, icon: TrendingUp, color: "bg-zencall-mint-100 text-zencall-mint-600" },
    { label: "RDV aujourd'hui", value: appointmentsToday, icon: Calendar, color: "bg-zencall-lavender-100 text-zencall-lavender-300" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
