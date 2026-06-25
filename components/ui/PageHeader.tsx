type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-950">{title}</h1>

        {description ? <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p> : null}
      </div>

      {children ? <div className="shrink-0">{children}</div> : null}
    </div>
  );
}
