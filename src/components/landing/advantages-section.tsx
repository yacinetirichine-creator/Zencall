"use client";

import { motion } from "framer-motion";
import { Zap, DollarSign, Clock, TrendingUp, Rocket, Link2 } from "lucide-react";
import { useI18n } from "@/i18n/provider";

const iconMap = {
  0: Zap,
  1: DollarSign,
  2: Clock,
  3: TrendingUp,
  4: Rocket,
  5: Link2,
};

export function AdvantagesSection() {
  const { t } = useI18n();
  const advantages = t("landing.advantages.items") as unknown as any[];

  return (
    <section id="features" className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            {t("landing.advantages.title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("landing.advantages.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage: any, index: number) => {
            const Icon = iconMap[index as keyof typeof iconMap];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-zencall-coral-200 hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-zencall-coral-400 to-zencall-coral-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-zencall-coral-200/50">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {advantage.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {advantage.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
