import { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--surface-alt)] text-[var(--muted-foreground)]",
  success:
    "bg-[var(--success-soft)] text-[var(--success)]",
  warning:
    "bg-[var(--warning-soft)] text-[var(--warning)]",
  danger:
    "bg-[var(--danger-soft)] text-[var(--danger)]",
  info:
    "bg-[var(--accent-soft)] text-[var(--accent)]",
};

export function Badge({
  children,
  variant = "default",
  icon,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-2.5 py-1
        text-xs font-medium
        rounded-[var(--radius-full)]
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
