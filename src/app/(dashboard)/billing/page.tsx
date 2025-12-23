"use client";

import { Header, PageHeader } from "@/components/layout";
import { Card, Button, Badge, Spinner, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui";
import { useUser, useSubscription, useInvoices } from "@/hooks";
import { Check, Download, CreditCard } from "lucide-react";
import { formatDate } from "@/lib/utils";

const plans = [
  { name: "free", displayName: "Free", price: 0, mins: 50, features: ["1 assistant", "Pas de numéro", "Support communauté"] },
  { name: "starter", displayName: "Starter", price: 49, mins: 200, features: ["2 assistants", "1 numéro", "Support email"] },
  { name: "pro", displayName: "Pro", price: 149, mins: 1000, features: ["5 assistants", "3 numéros", "API REST", "Webhooks"], popular: true },
  { name: "business", displayName: "Business", price: 299, mins: 3000, features: ["10 assistants", "5 numéros", "Campagnes", "Support prioritaire"] },
  { name: "enterprise", displayName: "Enterprise", price: null, mins: null, features: ["Assistants illimités", "Numéros illimités", "SLA garanti", "Support dédié"] },
];

export default function BillingPage() {
  const { organization, isLoading: userLoading } = useUser();
  const { subscription, isLoading: subLoading } = useSubscription(organization?.id);
  const { invoices, isLoading: invoicesLoading } = useInvoices(organization?.id);
  const currentPlan = organization?.plan || "free";

  if (userLoading || subLoading) {
    return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
  }

  return (
    <>
      <Header breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Facturation" }]} />
      <div className="p-6 space-y-6">
        <PageHeader title="Facturation" description="Gérez votre abonnement et vos factures" />

        {/* Plan actuel */}
        {subscription && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Abonnement actuel</h3>
                <p className="text-sm text-gray-500">Plan {plans.find(p => p.name === currentPlan)?.displayName}</p>
              </div>
              <Badge variant={subscription.status === 'active' ? 'green' : 'gray'}>
                {subscription.status === 'active' ? 'Actif' : subscription.status}
              </Badge>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Limite mensuelle</p>
                <p className="text-2xl font-bold text-gray-800">{organization?.monthly_call_limit}</p>
                <p className="text-xs text-gray-500">appels/mois</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Utilisés ce mois-ci</p>
                <p className="text-2xl font-bold text-zencall-coral-600">{organization?.monthly_calls_used}</p>
                <p className="text-xs text-gray-500">appels</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Disponibles</p>
                <p className="text-2xl font-bold text-zencall-mint-600">
                  {(organization?.monthly_call_limit || 0) - (organization?.monthly_calls_used || 0)}
                </p>
                <p className="text-xs text-gray-500">appels</p>
              </div>
            </div>
            {subscription.current_period_end && (
              <p className="text-sm text-gray-500 mt-4">
                Prochain renouvellement : {formatDate(subscription.current_period_end)}
              </p>
            )}
          </Card>
        )}

        {/* Plans disponibles */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Plans disponibles</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrent = plan.name === currentPlan;
              return (
                <Card key={plan.name} className={`p-6 ${plan.popular ? 'ring-2 ring-zencall-coral-300' : ''}`}>
                  {plan.popular && <Badge variant="coral" className="mb-2">Populaire</Badge>}
                  <h3 className="text-xl font-semibold text-gray-800">{plan.displayName}</h3>
                  <div className="my-4">
                    {plan.price !== null ? (
                      <>
                        <span className="text-4xl font-bold">{plan.price}€</span>
                        <span className="text-gray-500">/mois</span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-gray-800">Sur mesure</span>
                    )}
                  </div>
                  {plan.mins && <p className="text-sm text-gray-600 mb-4">{plan.mins} minutes incluses</p>}
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-zencall-mint-500" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={isCurrent ? "outline" : "primary"} 
                    className="w-full" 
                    disabled={isCurrent}
                  >
                    {isCurrent ? "Plan actuel" : plan.price !== null ? "Choisir" : "Nous contacter"}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Factures */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Historique de facturation</h3>
            {invoicesLoading ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : invoices.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">Aucune facture pour le moment</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      <TableCell>{formatDate(invoice.created_at)}</TableCell>
                      <TableCell>{invoice.amount_due.toFixed(2)} {invoice.currency}</TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === 'paid' ? 'green' : 'gray'}>
                          {invoice.status === 'paid' ? 'Payée' : invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {invoice.invoice_pdf_url && (
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
