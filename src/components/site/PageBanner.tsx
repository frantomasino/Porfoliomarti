import { Photo } from "@/components/site/Photo";

export function PageBanner({ src, alt }: { src?: string; alt: string }) {
  if (!src) return null;

  return (
    <div className="relative isolate overflow-hidden bg-ink">
      <div className="relative h-[min(42svh,22rem)] w-full md:h-[min(52svh,28rem)]">
        <Photo
          src={src}
          alt={alt}
          width={1800}
          priority
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-ink/15" />
      </div>
    </div>
  );
}
