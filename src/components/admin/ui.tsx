import { cx } from "@/lib/utils";

export const fieldClass =
  "w-full rounded-none border border-line bg-ivory px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink";

export const labelClass = "text-[11px] uppercase tracking-[0.18em] text-stone";

export const buttonClass =
  "border border-ink bg-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-ivory transition-opacity hover:opacity-80 disabled:opacity-40";

export const ghostButtonClass =
  "border border-line px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink";

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cx("grid gap-2", className)}>
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

export function AdminPage({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-ink">{title}</h1>
          {description ? <p className="mt-2 max-w-xl text-sm text-stone">{description}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}
