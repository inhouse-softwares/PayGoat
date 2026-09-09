import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, icon, rightIcon, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[var(--foreground)]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full h-11 px-3.5 text-sm
              bg-[var(--surface)] text-[var(--foreground)]
              border border-[var(--border)]
              rounded-[var(--radius-md)]
              placeholder:text-[var(--muted-foreground)]
              transition-all duration-150
              hover:border-[var(--accent)]
              focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${error ? "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/20" : ""}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="text-xs text-[var(--danger)]">{error}</p>
        )}
        {helper && !error && (
          <p className="text-xs text-[var(--muted-foreground)]">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
