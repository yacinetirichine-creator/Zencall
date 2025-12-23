"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, ArrowLeft, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    setSuccess(true);
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zencall-coral-50 via-white to-zencall-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-zencall-mint-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-zencall-mint-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Email envoyé</h2>
          <p className="text-gray-600 mb-6">Vérifiez votre boîte mail pour le lien de réinitialisation.</p>
          <Link href="/login" className="bg-zencall-coral-200 text-gray-800 px-6 py-2.5 rounded-xl font-medium inline-block">Retour</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zencall-coral-50 via-white to-zencall-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zencall-coral-200 to-zencall-coral-300 flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-gray-800">Zencall</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-gray-900">Mot de passe oublié</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="vous@exemple.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-zencall-coral-200 focus:ring-2 focus:ring-zencall-coral-100 outline-none" />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-zencall-coral-200 text-gray-800 py-2.5 rounded-xl font-medium hover:bg-zencall-coral-300 disabled:opacity-50 flex items-center justify-center">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Envoyer le lien"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" /> Retour
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
