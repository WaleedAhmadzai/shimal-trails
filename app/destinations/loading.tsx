import { CardGridSkeleton } from "@/components/destinations/CardGridSkeleton";

export default function DestinationsLoading() {
  return (
    <div role="status" aria-label="Loading destinations">
      <div className="border-b border-line bg-snow pt-32 pb-16">
        <div className="container-page space-y-5">
          <div className="h-3 w-40 animate-pulse rounded-full bg-paper-2" />
          <div className="h-16 w-2/3 max-w-xl animate-pulse rounded-2xl bg-paper-2" />
          <div className="h-5 w-1/2 max-w-md animate-pulse rounded-full bg-paper-2" />
        </div>
      </div>
      <div className="container-page space-y-10 py-14">
        <div className="h-13 animate-pulse rounded-full bg-paper-2" />
        <CardGridSkeleton />
      </div>
    </div>
  );
}
