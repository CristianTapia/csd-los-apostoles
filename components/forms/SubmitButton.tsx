"use client";

import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Guardando...",
  className = "",
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={[
        "w-full rounded-xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white transition",
        "hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto",
        className,
      ].join(" ")}
      {...props}
    >
      {pending ? pendingText : children}
    </button>
  );
}
