"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Calculator } from "lucide-react";
import { useI18n } from "@/i18n/provider";

export function ROISection() {
  const { t } = useI18n();
  const roi = t("landing.roi") as unknown as any;
  const calculations = roi.calculations as any[];

  const totalBefore = calculations.reduce((sum: number, calc: any) => {
    const amount = parseInt(calc.before.replace(/[^0-9]/g, "")) || 0;
    return sum + amount;
  }, 0);

  const totalAfter = calculations.reduce((sum: number, calc: any) => {
    const amount = parseInt(calc.after.replace(/[^0-9]/g, "")) || 0;
    return sum + amount;
  }, 0);

  const savings = totalBefore - totalAfter;

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-green-200 mb-6">
            <Calculator className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Calculateur ROI</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            {roi.title}
          </h2>
          <p className="text-xl text-gray-600">
            {roi.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
            <div className="text-left font-bold">Poste de coût</div>
            <div className="text-center font-bold flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-300" />
              {roi.before}
            </div>
            <div className="text-center font-bold flex items-center justify-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-300" />
              {roi.after}
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {calculations.map((calc: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-3 p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="text-gray-700 font-medium">{calc.item}</div>
                <div className="text-center text-red-600 font-bold">{calc.before}</div>
                <div className="text-center text-green-600 font-bold">{calc.after}</div>
              </motion.div>
            ))}
          </div>

          {/* Totals */}
          <div className="bg-gray-50 border-t-2 border-gray-200">
            <div className="grid grid-cols-3 p-6">
              <div className="text-gray-900 font-bold text-lg">Total mensuel</div>
              <div className="text-center text-red-600 font-bold text-lg">
                {totalBefore}€
              </div>
              <div className="text-center text-green-600 font-bold text-lg">
                {totalAfter}€
              </div>
            </div>
          </div>

          {/* Savings highlight */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8">
            <div className="text-center">
              <p className="text-white/90 font-semibold mb-2">💰 {roi.savings}</p>
              <p className="text-3xl md:text-4xl font-bold text-white mb-4">
                {savings.toLocaleString()}€/mois
              </p>
              <p className="text-white/80 text-sm">
                {roi.payback}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 text-lg mb-6">
            ⚡ Soit un retour sur investissement de <span className="font-bold text-green-600">9075%</span> la première année
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <div className="bg-white border-2 border-green-200 rounded-xl px-6 py-3">
              <p className="text-sm text-gray-600">Économie annuelle</p>
              <p className="text-2xl font-bold text-green-600">{(savings * 12).toLocaleString()}€</p>
            </div>
            <div className="bg-white border-2 border-blue-200 rounded-xl px-6 py-3">
              <p className="text-sm text-gray-600">Coût Zencall annuel</p>
              <p className="text-2xl font-bold text-blue-600">588€</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
