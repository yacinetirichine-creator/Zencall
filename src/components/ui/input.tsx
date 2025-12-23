import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}{props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{leftIcon}</div>}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl border bg-white text-gray-800",
            "placeholder:text-gray-400 transition-all",
            "focus:outline-none focus:ring-2 focus:ring-zencall-coral-100",
            leftIcon && "pl-10",
            error ? "border-red-500" : "border-gray-200 focus:border-zencall-coral-200",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}{props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          "w-full px-4 py-2.5 rounded-xl border bg-white text-gray-800 resize-none",
          "placeholder:text-gray-400 transition-all",
          "focus:outline-none focus:ring-2 focus:ring-zencall-coral-100",
          error ? "border-red-500" : "border-gray-200 focus:border-zencall-coral-200",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";
