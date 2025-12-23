import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+33") && cleaned.length === 12) {
    return `+33 ${cleaned.slice(3, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
  }
  return cleaned;
}

export function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
  return then.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

export function translateType(type: string): string {
  const t: Record<string, string> = {
    astreinte: "Astreinte", rdv: "Prise de RDV", info: "Information", outbound: "Appels sortants",
    completed: "Terminé", missed: "Manqué", transferred: "Transféré", failed: "Échoué", in_progress: "En cours",
    scheduled: "Planifié", confirmed: "Confirmé", cancelled: "Annulé", no_show: "Absent",
    draft: "Brouillon", running: "En cours", paused: "En pause",
    fr: "Français", es: "Espagnol", en: "Anglais", nl: "Néerlandais", ar: "Arabe",
    positive: "Positif", neutral: "Neutre", negative: "Négatif",
  };
  return t[type] || type;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    completed: "bg-zencall-mint-100 text-zencall-mint-600",
    missed: "bg-zencall-coral-100 text-zencall-coral-600",
    transferred: "bg-zencall-blue-100 text-zencall-blue-600",
    failed: "bg-red-100 text-red-600",
    in_progress: "bg-yellow-100 text-yellow-600",
    scheduled: "bg-zencall-lavender-100 text-zencall-lavender-300",
    confirmed: "bg-zencall-mint-100 text-zencall-mint-600",
    cancelled: "bg-gray-100 text-gray-600",
    draft: "bg-gray-100 text-gray-600",
    running: "bg-zencall-mint-100 text-zencall-mint-600",
    paused: "bg-yellow-100 text-yellow-600",
    positive: "bg-zencall-mint-100 text-zencall-mint-600",
    neutral: "bg-gray-100 text-gray-600",
    negative: "bg-zencall-coral-100 text-zencall-coral-600",
  };
  return colors[status] || "bg-gray-100 text-gray-600";
}

export function generateApiKey(): string {
  return "zc_" + Array.from({ length: 32 }, () => Math.random().toString(36).charAt(2)).join("");
}
