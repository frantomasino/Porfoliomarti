export function EmptyFrame({ kicker, title }: { kicker?: string; title: string }) {
  return (
    <div className="relative overflow-hidden border border-line bg-ivory">
      <div className="flex min-h-[42svh] flex-col justify-end px-6 py-10 md:min-h-[48svh] md:px-10 md:py-12">
        {kicker ? (
          <p className="text-[11px] uppercase tracking-[0.24em] text-bronze">{kicker}</p>
        ) : null}
        <p className="mt-3 max-w-md font-serif text-2xl leading-snug md:text-3xl">{title}</p>
      </div>
    </div>
  );
}
