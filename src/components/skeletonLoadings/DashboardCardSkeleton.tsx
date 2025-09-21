import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardCardSkeleton({
  count = 4,
}: {
  count?: number;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, idx) => (
        <Card
          key={idx}
          className="relative overflow-hidden rounded-3xl border dark:border-gray-800 backdrop-blur-md animate-pulse"
        >
          <div className="absolute inset-0 z-0 bg-white dark:bg-gray-800 rounded-3xl" />
          <div className="relative z-10 p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">
                <Skeleton className="w-24 h-4" />
              </CardTitle>
              <Skeleton className="w-6 h-6 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-20 h-8 mt-2" />
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}
