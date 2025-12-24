"use client";

import { Header } from "@/components/layout";
import { StatsCards, CallsChart, RecentCalls, LiveCallsMonitor } from "@/components/dashboard";
import { useUser, useStats, useCalls } from "@/hooks";
import { Spinner } from "@/components/ui";

export default function DashboardPage() {
  const { organization, isLoading: userLoading } = useUser();
  const { stats, isLoading: statsLoading } = useStats(organization?.id);
  const { calls, isLoading: callsLoading } = useCalls({ organizationId: organization?.id, limit: 10 });

  if (userLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Header title="Tableau de bord" description="Vue d'ensemble de votre activité" />
      <div className="p-6 space-y-6">
        {stats && organization && (
          <>
            <StatsCards 
              totalCalls={stats.totalCalls} 
              totalMinutes={stats.totalMinutes} 
              successRate={stats.successRate} 
              appointmentsToday={stats.appointmentsToday} 
            />
            
            {/* Moniteur d'appels en temps réel */}
            <LiveCallsMonitor organizationId={organization.id} />
            
            <div className="grid lg:grid-cols-2 gap-6">
              <CallsChart data={stats.callsByDay} />
              {!callsLoading && <RecentCalls calls={calls} />}
            </div>
          </>
        )}
      </div>
    </>
  );
}
