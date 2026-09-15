import { cx } from "@/lib/utils";

type PhotoProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function Photo({ src, alt, className, priority }: PhotoProps) {
  if (!src) return null;

  return (
    // Native img: the Next image optimizer failed on some Supabase storage URLs.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={src}
      src={src}
      alt={alt}
      className={cx("photo-fade", className)}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "low"}
      decoding="async"
      sizes="(max-width: 768px) 100vw, 900px"
    />
  );
}
