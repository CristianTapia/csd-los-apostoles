import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, error, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-font-main">
        {label}
      </label>

      {children}

      {hint ? <p className="text-sm text-font-secondary">{hint}</p> : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ className, ...props }: TextInputProps) {
  return (
    <input
      {...props}
      className={cn(
        "min-h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-font-main outline-none transition placeholder:text-font-secondary focus:border-black/30 dark:border-white/10 dark:bg-neutral-950",
        className,
      )}
    />
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea({ className, ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm text-font-main outline-none transition placeholder:text-font-secondary focus:border-black/30 dark:border-white/10 dark:bg-neutral-950",
        className,
      )}
    />
  );
}

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement>;

export function SelectInput({ className, children, ...props }: SelectInputProps) {
  return (
    <select
      {...props}
      className={cn(
        "min-h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-font-main outline-none transition focus:border-black/30 dark:border-white/10 dark:bg-neutral-950",
        className,
      )}
    >
      {children}
    </select>
  );
}

type InfoBoxProps = {
  children: ReactNode;
  className?: string;
};

export function InfoBox({ children, className }: InfoBoxProps) {
  return (
    <p className={cn("rounded-2xl bg-black/5 p-4 text-sm text-font-secondary dark:bg-white/10", className)}>
      {children}
    </p>
  );
}
