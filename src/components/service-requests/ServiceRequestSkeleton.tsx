import { Skeleton } from '@/components/ui/skeleton';

interface ServiceRequestSkeletonProps {
  count?: number;
}

export function ServiceRequestSkeleton({ count = 3 }: ServiceRequestSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Badges row */}
              <div className="flex items-center gap-3 mb-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
              {/* Title */}
              <Skeleton className="h-5 w-3/4 mb-1" />
              {/* Description */}
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-3" />
              {/* Meta info */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3.5 w-24" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
