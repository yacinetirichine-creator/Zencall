"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/i18n/provider";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || t("auth.login.errorFallback"));
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-display font-bold text-gray-900">{t("auth.login.title")}</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("auth.login.email")}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder={t("auth.login.emailPlaceholder")} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-zencall-coral-200 focus:ring-2 focus:ring-zencall-coral-100 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("auth.login.password")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder={t("auth.login.passwordPlaceholder")} className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-zencall-coral-200 focus:ring-2 focus:ring-zencall-coral-100 outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-zencall-coral-600 hover:underline">{t("auth.login.forgot")}</Link>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-zencall-coral-200 text-gray-800 py-2.5 rounded-xl font-medium hover:bg-zencall-coral-300 disabled:opacity-50 flex items-center justify-center">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("auth.login.submit")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {t("auth.login.noAccount")} <Link href="/register" className="text-zencall-coral-600 hover:underline font-medium">{t("auth.login.createAccount")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
