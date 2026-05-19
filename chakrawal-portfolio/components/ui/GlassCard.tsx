import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "article" | "section";
  children: ReactNode;
  className?: string;
}

export function GlassCard({
  as,
  children,
  className,
  ...props
}: GlassCardProps) {
  const Component = as ?? "div";

  return (
    <Component className={cn("glass-card", className)} {...props}>
      {children}
    </Component>
  );
}
