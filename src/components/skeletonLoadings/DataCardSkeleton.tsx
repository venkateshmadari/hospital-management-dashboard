import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const DataCardSkeleton = () => {
  return (
    <Card className="bg-background rounded-3xl">
      <CardContent className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="overflow-hidden inline-flex items-center justify-between w-full">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center flex-col gap-2">
            <div className="inline-flex items-center text-sm gap-1.5">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataCardSkeleton;
