"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  { name: "Starter", price: "49", mins: "200 min", features: ["2 assistants", "1 numéro", "Support email"] },
  { name: "Pro", price: "149", mins: "1000 min", features: ["5 assistants", "3 numéros", "API REST", "Webhooks"], popular: true },
  { name: "Business", price: "299", mins: "3000 min", features: ["10 assistants", "5 numéros", "Campagnes", "Support prioritaire"] },
];

export const PricingSection = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-zencall-blue-50/30 to-white pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            Tarifs <span className="text-zencall-coral-500">Transparents</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choisissez le plan adapté à votre volume d'appels. Changez à tout moment.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-white rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 ${
                plan.popular 
                  ? 'shadow-xl border-2 border-zencall-coral-200 ring-4 ring-zencall-coral-50' 
                  : 'shadow-lg border border-gray-100 hover:shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-zencall-coral-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                  Le plus populaire
                </div>
              )}
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-bold text-gray-900">{plan.price}€</span>
                <span className="text-gray-500">/mois</span>
              </div>
              <div className="bg-zencall-blue-50 rounded-xl p-4 mb-8 text-center">
                <span className="block text-2xl font-bold text-zencall-blue-600">{plan.mins}</span>
                <span className="text-sm text-zencall-blue-400">d'appels inclus</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-zencall-mint-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-zencall-mint-600" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link 
                href="/register" 
                className={`block w-full py-4 rounded-xl text-center font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-zencall-coral-400 to-zencall-coral-500 text-white shadow-lg hover:shadow-zencall-coral-200/50 hover:scale-[1.02]'
                    : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                }`}
              >
                Choisir {plan.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
