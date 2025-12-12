import { Skeleton } from '@/components/ui/skeleton';

export function VehicleSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
        </div>
        <Skeleton className="h-7 w-28" />
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </div>
    </div>
  );
}
