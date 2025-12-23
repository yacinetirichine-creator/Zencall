import Link from "next/link";
import { Phone, Bot, Calendar, BarChart3, ArrowRight, Check, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zencall-coral-50 via-white to-zencall-blue-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zencall-coral-200 to-zencall-coral-300 flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-800">Zencall</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-800">Connexion</Link>
            <Link href="/register" className="bg-zencall-coral-200 text-gray-800 px-4 py-2 rounded-xl text-sm font-medium hover:bg-zencall-coral-300">Essai gratuit</Link>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zencall-coral-100 text-zencall-coral-600 text-sm font-medium mb-6">
            <Star className="w-4 h-4" /> Nouveau : IA multilingue
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-6">
            Assistant téléphonique<br /><span className="text-zencall-coral-500">propulsé par l'IA</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Automatisez vos appels avec une IA conversationnelle naturelle. Astreinte 24/7, prise de RDV, information client.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="bg-zencall-coral-200 text-gray-800 px-8 py-3 rounded-xl text-lg font-medium hover:bg-zencall-coral-300 inline-flex items-center gap-2">
              Commencer gratuitement <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">14 jours d'essai gratuit • Sans carte bancaire</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center text-gray-900 mb-12">Fonctionnalités</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Bot, title: "Assistant IA", desc: "Conversations naturelles multilingues" },
              { icon: Phone, title: "Astreinte 24/7", desc: "Ne manquez plus aucun appel" },
              { icon: Calendar, title: "Prise de RDV", desc: "Synchronisation calendrier" },
              { icon: BarChart3, title: "Analytics", desc: "Tableau de bord complet" },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-zencall-coral-100 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-zencall-coral-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center text-gray-900 mb-12">Tarifs simples</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Starter", price: "49", mins: "100 min", features: ["1 assistant", "1 numéro", "Support email"] },
              { name: "Pro", price: "149", mins: "500 min", features: ["3 assistants", "2 numéros", "API REST"], popular: true },
              { name: "Business", price: "299", mins: "1 500 min", features: ["10 assistants", "5 numéros", "Campagnes"] },
            ].map((plan, i) => (
              <div key={i} className={`bg-white rounded-2xl shadow-soft border p-8 ${plan.popular ? 'border-zencall-coral-300 ring-2 ring-zencall-coral-200' : 'border-gray-100'}`}>
                {plan.popular && <span className="bg-zencall-coral-100 text-zencall-coral-600 text-xs font-medium px-2.5 py-0.5 rounded-full">Populaire</span>}
                <h3 className="text-xl font-semibold text-gray-800 mt-2">{plan.name}</h3>
                <div className="my-4"><span className="text-4xl font-bold">{plan.price}€</span><span className="text-gray-500">/mois</span></div>
                <p className="text-sm text-gray-600 mb-6">{plan.mins} incluses</p>
                <ul className="space-y-2 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-zencall-mint-500" />{f}</li>
                  ))}
                </ul>
                <Link href="/register" className={`block w-full text-center py-2.5 rounded-xl font-medium ${plan.popular ? 'bg-zencall-coral-200 text-gray-800 hover:bg-zencall-coral-300' : 'border-2 border-gray-200 text-gray-700 hover:border-zencall-coral-200'}`}>
                  Commencer
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2"><Phone className="w-5 h-5 text-zencall-coral-300" /><span className="font-bold">Zencall</span></div>
          <p className="text-sm text-gray-400">© 2024 Zencall. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
