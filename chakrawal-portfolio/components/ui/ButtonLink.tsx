import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  showIcon?: boolean;
}

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
  showIcon = true,
  ...props
}: ButtonLinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  const classes = cn("button-link", `button-link-${variant}`, className);
  const content = (
    <>
      <span>{children}</span>
      {showIcon ? <ArrowUpRight aria-hidden="true" size={18} /> : null}
    </>
  );

  if (isExternal) {
    return (
      <a
        className={classes}
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <Link className={classes} href={href} {...props}>
      {content}
    </Link>
  );
}
