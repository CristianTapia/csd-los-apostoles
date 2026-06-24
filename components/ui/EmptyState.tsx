import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div>
        <h2 className="text-base font-semibold text-font-main dark:text-white">{title}</h2>
        {description ? <p className="mt-1 text-sm text-font-secondary">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </Card>
  );
}
