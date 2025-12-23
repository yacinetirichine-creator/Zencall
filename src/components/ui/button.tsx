import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-zencall-coral-200 text-gray-800 hover:bg-zencall-coral-300 shadow-soft",
      secondary: "bg-zencall-blue-200 text-gray-800 hover:bg-zencall-blue-300 shadow-soft",
      outline: "border-2 border-gray-200 bg-white text-gray-700 hover:border-zencall-coral-200",
      ghost: "text-gray-600 hover:bg-gray-100",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
      icon: "p-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zencall-coral-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant], sizes[size], className
        )}
        {...props}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
      </button>
    );
  }
);
Button.displayName = "Button";
