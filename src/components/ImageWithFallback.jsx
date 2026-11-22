import { useState } from 'react';

// Shows a labelled placeholder when a record has no image or it fails to load.
export default function ImageWithFallback({ src, alt, label, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`image-fallback ${className}`} role="img" aria-label={`No photo available for ${label}`}>
        <span aria-hidden="true">⛰</span>
        <span>Photo coming soon</span>
      </div>
    );
  }
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}
