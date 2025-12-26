"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/provider";
import { PricingCard } from "@/components/pricing/pricing-card";
import { CountrySelector } from "@/components/pricing/country-selector";

export const PricingSection = () => {
  const { t } = useI18n();

  const plans = [
    { key: "starter" as const, popular: false },
    { key: "pro" as const, popular: true },
    { key: "business" as const, popular: false },
  ];

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
            {t("pricing.titleA")} <span className="text-zencall-coral-500">{t("pricing.titleB")}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {t("pricing.subtitle")}
          </p>
          
          {/* Country Selector */}
          <div className="flex justify-center">
            <CountrySelector className="w-64" />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <PricingCard plan={plan.key} popular={plan.popular} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
