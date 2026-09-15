import { cx } from "@/lib/utils";

export const fieldClass =
  "w-full rounded-none border border-line bg-ivory px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink";

export const labelClass = "text-[11px] uppercase tracking-[0.18em] text-stone";

export const buttonClass =
  "border border-ink bg-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-ivory transition-opacity hover:opacity-80 disabled:opacity-40";

export const ghostButtonClass =
  "border border-line px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink";

export function TrashButton({
  onClick,
  label = "Eliminar",
  className,
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cx(
        "flex h-11 w-11 items-center justify-center bg-ink text-ivory transition-opacity hover:opacity-80",
        className,
      )}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 7h14" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 7V5.8A1.8 1.8 0 0 1 11.8 4h.4A1.8 1.8 0 0 1 14 5.8V7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 7l.8 12.2A1.5 1.5 0 0 0 10.3 20.5h3.4a1.5 1.5 0 0 0 1.5-1.3L16 7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10.5 11v6M13.5 11v6" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </button>
  );
}

export function OrderButtons({
  onUp,
  onDown,
  disableUp,
  disableDown,
}: {
  onUp: () => void;
  onDown: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
}) {
  return (
    <div className="flex">
      <button
        type="button"
        aria-label="Subir"
        title="Subir"
        disabled={disableUp}
        onClick={onUp}
        className="flex h-11 w-11 items-center justify-center border border-line text-ink transition-colors hover:border-ink disabled:opacity-30"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Bajar"
        title="Bajar"
        disabled={disableDown}
        onClick={onDown}
        className="-ml-px flex h-11 w-11 items-center justify-center border border-line text-ink transition-colors hover:border-ink disabled:opacity-30"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 10l6 6 6-6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
    </div>
  );
}

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
