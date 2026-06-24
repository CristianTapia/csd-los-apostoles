"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/auth/login/actions";
import type { ActionResult } from "@/server/actions/types";

const initialState: ActionResult = { ok: true };

type LoginFormProps = {
  nextPath: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={nextPath} />

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="min-h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-sm text-font-main outline-none focus:border-black dark:border-white/10 dark:bg-neutral-950 dark:text-white"
        />
        {!state.ok && state.fieldErrors?.email ? (
          <p className="text-sm text-red-600">{state.fieldErrors.email[0]}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="min-h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-sm text-font-main outline-none focus:border-black dark:border-white/10 dark:bg-neutral-950 dark:text-white"
        />
        {!state.ok && state.fieldErrors?.password ? (
          <p className="text-sm text-red-600">{state.fieldErrors.password[0]}</p>
        ) : null}
      </div>

      {!state.ok ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="min-h-11 w-full rounded-lg bg-black px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
      >
        {pending ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
