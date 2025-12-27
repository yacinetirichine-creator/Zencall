"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useI18n } from "@/i18n/provider";

export function ComparisonSection() {
  const { t } = useI18n();
  const comparison = t("landing.comparison") as unknown as any;
  const metrics = comparison.metrics as any[];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            {comparison.title}
          </h2>
          <p className="text-xl text-gray-600">
            {comparison.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <table className="w-full border-collapse bg-white rounded-2xl overflow-hidden shadow-xl">
            <thead>
              <tr className="bg-gradient-to-r from-zencall-coral-500 to-zencall-coral-600">
                <th className="px-6 py-4 text-left text-white font-bold">Critère</th>
                <th className="px-6 py-4 text-center text-white font-bold bg-zencall-coral-700">
                  {comparison.competitors.zencall} ⭐
                </th>
                <th className="px-6 py-4 text-center text-white font-bold">
                  {comparison.competitors.aircall}
                </th>
                <th className="px-6 py-4 text-center text-white font-bold">
                  {comparison.competitors.ringover}
                </th>
                <th className="px-6 py-4 text-center text-white font-bold">
                  {comparison.competitors.traditional}
                </th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric: any, index: number) => (
                <tr
                  key={index}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {metric.name}
                  </td>
                  <td className="px-6 py-4 text-center bg-zencall-coral-50 font-bold text-zencall-coral-700">
                    {renderCell(metric.zencall)}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    {renderCell(metric.aircall)}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    {renderCell(metric.ringover)}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    {renderCell(metric.traditional)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl px-8 py-4">
            <div className="text-3xl font-bold text-green-600">💰</div>
            <div className="text-left">
              <p className="text-sm text-gray-600 font-medium">Économie moyenne</p>
              <p className="text-2xl font-bold text-gray-900">
                70% sur vos coûts de téléphonie
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function renderCell(value: string) {
  if (value === "✓ Inclus" || value.includes("✓")) {
    return (
      <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
        <Check className="w-5 h-5" /> Inclus
      </span>
    );
  }
  if (value === "✗" || value.includes("✗")) {
    return (
      <span className="inline-flex items-center gap-1 text-gray-400">
        <X className="w-5 h-5" />
      </span>
    );
  }
  return value;
}
