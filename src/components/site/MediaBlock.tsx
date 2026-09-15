import { Photo } from "@/components/site/Photo";
import { isFileVideo, videoEmbedUrl } from "@/lib/media";
import type { ProjectImage } from "@/lib/types";

export function MediaBlock({
  item,
  alt,
  className = "",
}: {
  item: ProjectImage;
  alt: string;
  className?: string;
}) {
  const embed = videoEmbedUrl(item.url);
  const isVideo = item.kind === "video" || Boolean(embed) || isFileVideo(item.url);

  if (isVideo && embed) {
    return (
      <iframe
        src={embed}
        title={alt}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className={`absolute inset-0 h-full w-full ${className}`}
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
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
      />
    );
  }

  return <Photo src={item.url} alt={alt} className={`absolute inset-0 h-full w-full object-cover ${className}`} />;
}
