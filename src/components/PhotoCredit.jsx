// Attribution required by the photo's Creative Commons licence.
export default function PhotoCredit({ credit }) {
  const { author, license, licenseUrl, sourceUrl } = credit;
  return (
    <figcaption className="photo-credit">
      Photo: <a href={sourceUrl}>{author}</a>, Wikimedia Commons,{' '}
      {licenseUrl ? <a href={licenseUrl}>{license}</a> : license} (cropped)
    </figcaption>
  );
}
