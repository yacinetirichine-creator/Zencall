import * as React from "react";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  fallback?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, fallback, size = "md", className }) => {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-12 w-12 text-base" };
  return (
    <div className={cn("rounded-full overflow-hidden bg-zencall-coral-100 flex items-center justify-center font-medium text-zencall-coral-600", sizes[size], className)}>
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <span>{getInitials(fallback || "?")}</span>}
    </div>
  );
};
