"use client";

import Link from "next/link";
import { Phone, ArrowRight, Star, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hero3D } from "@/components/landing/hero-3d";
import { AudioIntro } from "@/components/landing/audio-intro";
import { PricingSection } from "@/components/landing/pricing-section";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white selection:bg-zencall-coral-100 selection:text-zencall-coral-900 font-sans">
      <AudioIntro />
      
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zencall-coral-400 to-zencall-coral-600 flex items-center justify-center shadow-lg shadow-zencall-coral-200/50">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-2xl text-gray-900 tracking-tight">Zencall</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-zencall-coral-600 transition-colors">Fonctionnalités</Link>
              <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-zencall-coral-600 transition-colors">Tarifs</Link>
              <Link href="/login" className="text-sm font-medium text-gray-900 hover:text-zencall-coral-600 transition-colors">Connexion</Link>
              <Link href="/register" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-lg hover:-translate-y-0.5">
                Essai gratuit
              </Link>
            </nav>

            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-lg font-medium">
              <Link href="#features" onClick={() => setIsMenuOpen(false)}>Fonctionnalités</Link>
              <Link href="#pricing" onClick={() => setIsMenuOpen(false)}>Tarifs</Link>
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>Connexion</Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)} className="text-zencall-coral-600">S'inscrire</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zencall-coral-50 border border-zencall-coral-100 text-zencall-coral-600 text-sm font-medium mb-8 animate-fade-in-up">
              <Star className="w-4 h-4 fill-current" /> 
              <span>Nouvelle IA Générative 2.0</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 mb-8 leading-[1.1]">
              Votre standard <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zencall-coral-500 to-zencall-blue-500">
                intelligent & humain
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
              Ne manquez plus aucun appel. Notre IA répond, qualifie et prend vos rendez-vous 24/7 avec une voix ultra-réaliste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="bg-zencall-coral-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-zencall-coral-600 transition-all shadow-xl shadow-zencall-coral-200 hover:-translate-y-1 flex items-center justify-center gap-2">
                Commencer maintenant <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#demo" className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center">
                Écouter une démo
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                ))}
              </div>
              <p>Déjà adopté par +500 entreprises</p>
            </div>
          </motion.div>
          
          <div className="relative lg:h-[600px] flex items-center justify-center">
            <Hero3D />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <div id="pricing">
        <PricingSection />
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Zencall</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-600">
            <Link href="/legal/privacy">Confidentialité</Link>
            <Link href="/legal/terms">CGV</Link>
            <Link href="mailto:contact@zencall.com">Contact</Link>
          </div>
          <p className="text-sm text-gray-400">© 2024 Zencall Inc.</p>
        </div>
      </footer>
    </div>
  );
}
