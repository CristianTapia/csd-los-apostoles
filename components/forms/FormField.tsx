import type { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: string;
};

export function FormField({ label, name, error, className = "", ...props }: FormFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>

      <input
        name={name}
        className={[
          "rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition",
          "focus:border-gray-400 focus:ring-4 focus:ring-gray-100",
          className,
        ].join(" ")}
        {...props}
      />

      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
