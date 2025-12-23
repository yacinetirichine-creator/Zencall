"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options, value, onChange, placeholder = "Sélectionner...", label, error, className
}) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          "w-full px-4 py-2.5 rounded-xl border bg-white text-gray-800 appearance-none",
          "focus:outline-none focus:ring-2 focus:ring-zencall-coral-100",
          error ? "border-red-500" : "border-gray-200 focus:border-zencall-coral-200",
          className
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);
