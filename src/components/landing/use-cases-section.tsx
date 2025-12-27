"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import Link from "next/link";

export function UseCasesSection() {
  const { t } = useI18n();
  const useCases = t("landing.useCases") as unknown as any;
  const cases = useCases.cases as any[];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            {useCases.title}
          </h2>
          <p className="text-xl text-gray-600">
            {useCases.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((useCase: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              {/* Accent gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-zencall-coral-400 to-zencall-blue-500"></div>
              
              <div className="text-5xl mb-4">{useCase.icon}</div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {useCase.sector}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-red-600 mb-2">❌ Problème :</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {useCase.problem}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-blue-600 mb-2">💡 Solution :</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {useCase.solution}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-green-600 mb-2">✅ Résultat :</p>
                  <p className="text-gray-900 font-bold text-sm leading-relaxed">
                    {useCase.result}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link 
            href="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-zencall-coral-500 to-zencall-coral-600 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            Démarrer mon essai gratuit
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Aucune carte bancaire requise • Déploiement en 5 minutes
          </p>
        </motion.div>
      </div>
    </section>
  );
}
