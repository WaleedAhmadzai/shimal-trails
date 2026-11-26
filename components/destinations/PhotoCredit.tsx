import type { Photo } from "@/types";

export interface PhotoCreditProps {
  photo: Photo;
  className?: string;
}

export function PhotoCredit({ photo, className }: PhotoCreditProps) {
  return (
    <p className={className}>
      Photo:{" "}
      <a href={photo.sourceUrl} target="_blank" rel="noreferrer" className="underline decoration-current/30 underline-offset-2 hover:decoration-current">
        {photo.author}
      </a>
      , {photo.licence}, via Wikimedia Commons
    </p>
  );
}
