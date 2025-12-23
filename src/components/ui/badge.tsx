import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "coral" | "blue" | "mint" | "gray" | "red" | "yellow";
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = "default", ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    coral: "bg-zencall-coral-100 text-zencall-coral-600",
    blue: "bg-zencall-blue-100 text-zencall-blue-600",
    mint: "bg-zencall-mint-100 text-zencall-mint-600",
    gray: "bg-gray-100 text-gray-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)} {...props} />
  );
};
