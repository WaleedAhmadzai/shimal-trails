export default function DestinationLoading() {
  return (
    <div role="status" aria-label="Loading destination">
      <div className="flex min-h-[78svh] flex-col justify-end bg-ink pb-10">
        <div className="container-page space-y-5">
          <div className="h-6 w-48 animate-pulse rounded-full bg-snow/10" />
          <div className="h-20 w-3/4 max-w-2xl animate-pulse rounded-2xl bg-snow/10" />
          <div className="h-5 w-1/2 max-w-lg animate-pulse rounded-full bg-snow/10" />
        </div>
      </div>
      <div className="container-page grid gap-6 py-16 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-paper-2" />
        ))}
      </div>
    </div>
  );
}
