"use client";

import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, disabled }) => (
  <label className={cn("inline-flex items-center gap-3 cursor-pointer", disabled && "opacity-50 cursor-not-allowed")}>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn("relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors", checked ? "bg-zencall-coral-400" : "bg-gray-200")}
    >
      <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform mt-0.5", checked ? "translate-x-5" : "translate-x-0.5")} />
    </button>
    {label && <span className="text-sm text-gray-700">{label}</span>}
  </label>
);
