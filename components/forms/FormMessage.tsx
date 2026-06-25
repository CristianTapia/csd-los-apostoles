type FormMessageProps = {
  ok: boolean;
  message: string;
};

export function FormMessage({ ok, message }: FormMessageProps) {
  if (!message) return null;

  return (
    <div
      className={[
        "rounded-xl border p-4 text-sm",
        ok ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700",
      ].join(" ")}
    >
      {message}
    </div>
  );
}
