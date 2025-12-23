"use client";

import Link from "next/link";
import { Header, PageHeader } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { Key, Webhook, Calendar, ArrowRight } from "lucide-react";

export default function IntegrationsPage() {
  const integrations = [
    { title: "Clés API", desc: "Gérez vos clés d'accès à l'API REST", icon: Key, href: "/dashboard/integrations/api-keys" },
    { title: "Webhooks", desc: "Configurez les notifications en temps réel", icon: Webhook, href: "/dashboard/integrations/webhooks" },
    { title: "Calendriers", desc: "Connectez Google Calendar ou Outlook", icon: Calendar, href: "/dashboard/integrations/calendars" },
  ];

  return (
    <>
      <Header breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Intégrations" }]} />
      <div className="p-6">
        <PageHeader title="Intégrations" description="Connectez Zencall à vos outils" />
        <div className="grid md:grid-cols-3 gap-4">
          {integrations.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="p-6 hover:shadow-medium transition-shadow cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-zencall-coral-100 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-zencall-coral-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{item.desc}</p>
                <span className="text-sm text-zencall-coral-600 flex items-center gap-1">Configurer <ArrowRight className="w-4 h-4" /></span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
