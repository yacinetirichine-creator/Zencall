"use client";

import { Header, PageHeader } from "@/components/layout";
import { Card, Button, Badge, Spinner, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui";
import { useUser, useSubscription, useInvoices } from "@/hooks";
import { Check, Download, CreditCard, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

const plans = [
  { name: "free", displayName: "Free", price: 0, mins: 50, features: ["1 assistant", "Pas de numéro", "Support communauté"] },
  { name: "starter", displayName: "Starter", price: 49, mins: 200, features: ["2 assistants", "1 numéro", "Support email"] },
  { name: "pro", displayName: "Pro", price: 149, mins: 1000, features: ["5 assistants", "3 numéros", "API REST", "Webhooks"], popular: true },
  { name: "business", displayName: "Business", price: 299, mins: 3000, features: ["10 assistants", "5 numéros", "Campagnes", "Support prioritaire"] },
];

export default function BillingPage() {
  const { organization, isLoading: userLoading } = useUser();
  const { subscription, isLoading: subLoading } = useSubscription(organization?.id);
  const { invoices, isLoading: invoicesLoading } = useInvoices(organization?.id);
  const currentPlan = organization?.plan || "free";

  const handleUpgrade = (planName: string) => {
    // Simulation de l'upgrade
    alert(`Redirection vers le paiement pour le plan ${planName}... (Intégration Stripe à venir)`);
  };

  if (userLoading || subLoading) {
    return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
  }

  return (
    <>
      <Header breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Facturation" }]} />
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <PageHeader title="Facturation" description="Gérez votre abonnement et vos factures" />

        {/* Plan actuel */}
        {subscription && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 border-zencall-blue-100 bg-gradient-to-br from-white to-zencall-blue-50/30">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-display font-bold text-gray-900">Abonnement actuel</h3>
                  <p className="text-sm text-gray-500">Plan {plans.find(p => p.name === currentPlan)?.displayName}</p>
                </div>
                <Badge variant={subscription.status === 'active' ? 'mint' : 'gray'} className="px-3 py-1">
                  {subscription.status === 'active' ? 'Actif' : subscription.status}
                </Badge>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1">Limite mensuelle</p>
                  <p className="text-3xl font-display font-bold text-gray-900">{organization?.monthly_call_limit}</p>
                  <p className="text-xs text-gray-400 mt-1">appels/mois</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1">Utilisés ce mois-ci</p>
                  <p className="text-3xl font-display font-bold text-zencall-coral-600">{organization?.monthly_calls_used}</p>
                  <p className="text-xs text-gray-400 mt-1">appels</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1">Disponibles</p>
                  <p className="text-3xl font-display font-bold text-zencall-mint-600">
                    {(organization?.monthly_call_limit || 0) - (organization?.monthly_calls_used || 0)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">appels</p>
                </div>
              </div>
              {subscription.current_period_end && (
                <p className="text-sm text-gray-500 mt-6 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Prochain renouvellement : {formatDate(subscription.current_period_end)}
                </p>
              )}
            </Card>
          </motion.div>
        )}

        {/* Plans disponibles */}
        <div>
          <h3 className="text-xl font-display font-bold text-gray-900 mb-6">Changer de plan</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => {
              const isCurrent = plan.name === currentPlan;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative bg-white rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                    plan.popular 
                      ? 'shadow-xl border-2 border-zencall-coral-200 ring-4 ring-zencall-coral-50' 
                      : 'shadow-lg border border-gray-100 hover:shadow-xl'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-zencall-coral-500 text-white px-3 py-0.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Populaire
                    </div>
                  )}
                  <h3 className="text-lg font-display font-bold text-gray-900">{plan.displayName}</h3>
                  <div className="my-3">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}€</span>
                    <span className="text-gray-500 text-sm">/mois</span>
                  </div>
                  <div className="bg-zencall-blue-50 rounded-xl p-3 mb-4 text-center">
                    <span className="block text-lg font-bold text-zencall-blue-600">{plan.mins}</span>
                    <span className="text-xs text-zencall-blue-400">minutes incluses</span>
                  </div>
                  <ul className="space-y-3 mb-6 min-h-[120px]">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-zencall-mint-500 flex-shrink-0 mt-0.5" /> 
                        <span className="leading-tight">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => handleUpgrade(plan.displayName)}
                    className={`w-full rounded-xl font-semibold py-6 ${
                      isCurrent 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100" 
                        : plan.popular
                          ? "bg-gradient-to-r from-zencall-coral-400 to-zencall-coral-500 hover:shadow-lg hover:shadow-zencall-coral-200/50 text-white border-0"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                    disabled={isCurrent}
                  >
                    {isCurrent ? "Plan actuel" : "Choisir"}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Factures */}
        <Card className="overflow-hidden border-gray-100 shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-display font-bold text-gray-900 mb-4">Historique de facturation</h3>
            {invoicesLoading ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <CreditCard className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-gray-500 text-sm">Aucune facture pour le moment</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Numéro</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium text-gray-900">{invoice.invoice_number}</TableCell>
                      <TableCell className="text-gray-500">{formatDate(invoice.created_at)}</TableCell>
                      <TableCell className="font-medium">{invoice.amount_due.toFixed(2)} {invoice.currency}</TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === 'paid' ? 'mint' : 'gray'} className="rounded-lg">
                          {invoice.status === 'paid' ? 'Payée' : invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {invoice.invoice_pdf_url && (
                          <Button variant="ghost" size="sm" className="hover:bg-gray-100 rounded-lg">
                            <Download className="w-4 h-4 text-gray-500" />
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
