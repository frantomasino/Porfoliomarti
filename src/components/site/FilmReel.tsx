import { Photo } from "@/components/site/Photo";

export function FilmReel({ photos, alt }: { photos: string[]; alt: string }) {
  if (photos.length < 2) return null;
  const loop = [...photos, ...photos];

  return (
    <div className="film-reel" aria-label={alt}>
      <div className="film-reel-track">
        {loop.map((src, index) => (
          <div key={`${src}-${index}`} className="film-reel-item">
            <Photo src={src} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
