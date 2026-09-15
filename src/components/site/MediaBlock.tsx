import { Photo } from "@/components/site/Photo";
import { isFileVideo, videoEmbedUrl } from "@/lib/media";
import type { ProjectImage } from "@/lib/types";

export function MediaBlock({
  item,
  alt,
  className = "",
  layout = "fill",
}: {
  item: ProjectImage;
  alt: string;
  className?: string;
  layout?: "fill" | "natural";
}) {
  const embed = videoEmbedUrl(item.url);
  const isVideo = item.kind === "video" || Boolean(embed) || isFileVideo(item.url);
  const natural = layout === "natural";
  const mediaClass = natural
    ? `mx-auto block max-h-[68svh] w-auto max-w-full object-contain ${className}`
    : `absolute inset-0 h-full w-full object-cover ${className}`;

  if (isVideo && embed) {
    return (
      <iframe
        src={embed}
        title={alt}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className={natural ? `aspect-video h-auto max-h-[78vh] w-full max-w-4xl ${className}` : mediaClass}
      />
    );
  }

  if (isVideo) {
    return (
      <video
        src={item.url}
        controls
        playsInline
        preload="metadata"
        className={mediaClass}
      />
    );
  }

  return <Photo src={item.url} alt={alt} width={1400} className={mediaClass} />;
}
