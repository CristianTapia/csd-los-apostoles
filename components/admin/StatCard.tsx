import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

type StatCardProps = {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
};

export function StatCard({ label, value, helper, icon }: StatCardProps) {
  return (
    <Card className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-font-secondary">{label}</p>
        <p className="mt-2 text-2xl font-bold text-font-main dark:text-white">{value}</p>
        {helper ? <p className="mt-1 text-xs text-font-secondary">{helper}</p> : null}
      </div>
      {icon ? <div className="text-font-secondary">{icon}</div> : null}
    </Card>
  );
}
