import { Photo } from "@/components/site/Photo";
import { isFileVideo } from "@/lib/media";

export function FilmReel({ photos, alt }: { photos: string[]; alt: string }) {
  if (photos.length < 2) return null;
  const loop = [...photos, ...photos];

  return (
    <div className="film-reel" aria-label={alt}>
      <div className="film-reel-track">
        {loop.map((src, index) => (
          <div key={`${src}-${index}`} className="film-reel-item">
            {isFileVideo(src) ? (
              <video
                src={src}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <Photo src={src} alt="" className="h-full w-full object-cover" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
