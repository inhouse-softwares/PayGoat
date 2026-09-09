import { CheckCircle, Clock, XCircle } from "lucide-react";

type Status = "successful" | "success" | "pending" | "failed" | "error";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<
  Status,
  { label: string; styles: string; icon: React.ReactNode }
> = {
  successful: {
    label: "Successful",
    styles: "bg-[var(--success-soft)] text-[var(--success)]",
    icon: <CheckCircle size={14} />,
  },
  success: {
    label: "Success",
    styles: "bg-[var(--success-soft)] text-[var(--success)]",
    icon: <CheckCircle size={14} />,
  },
  pending: {
    label: "Pending",
    styles: "bg-[var(--warning-soft)] text-[var(--warning)]",
    icon: <Clock size={14} />,
  },
  failed: {
    label: "Failed",
    styles: "bg-[var(--danger-soft)] text-[var(--danger)]",
    icon: <XCircle size={14} />,
  },
  error: {
    label: "Error",
    styles: "bg-[var(--danger-soft)] text-[var(--danger)]",
    icon: <XCircle size={14} />,
  },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1
        text-xs font-medium
        rounded-[var(--radius-full)]
        ${config.styles}
        ${className}
      `}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
