import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  style?: React.CSSProperties;
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
  style,
}: CardProps) {
  return (
    <div
      className={`
        bg-[var(--surface)]
        rounded-[var(--radius-xl)]
        border border-[var(--border)]
        shadow-[var(--shadow-card)]
        ${paddingStyles[padding]}
        ${
          hover
            ? "transition-all duration-200 ease-out hover:shadow-[var(--shadow-lg)] hover:border-[var(--accent)]/20 hover:-translate-y-0.5"
            : ""
        }
        ${className}
      `}
      style={style}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h3 className={`text-base font-semibold text-[var(--foreground)] ${className}`}>
      {children}
    </h3>
  );
}
