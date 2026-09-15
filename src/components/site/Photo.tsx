type PhotoProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function Photo({ src, alt, className, priority }: PhotoProps) {
  if (!src) return null;

  return (
    // Native img avoids Next.js optimizer failures with Unsplash/Supabase URLs.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "low"}
      decoding="async"
      sizes="(max-width: 768px) 100vw, 80vw"
    />
  );
}
