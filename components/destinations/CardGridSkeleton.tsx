export interface CardGridSkeletonProps {
  count?: number;
}

/** Placeholder cards the same size as real ones, so nothing jumps on load. */
export function CardGridSkeleton({ count = 6 }: CardGridSkeletonProps) {
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <div className="aspect-[4/5] animate-pulse rounded-[1.4rem] bg-paper-2" />
          <div className="mt-3 flex justify-between px-1">
            <div className="h-4 w-28 animate-pulse rounded-full bg-paper-2" />
            <div className="h-4 w-24 animate-pulse rounded-full bg-paper-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
