import { Skeleton } from "@/components/ui/skeleton";

const DoctorStatsCardsSkeleton = ({ length = 3 }: { length?: number }) => {
  return Array.from({ length }).map((_, i) => (
    <div
      key={i}
      className="min-w-[200px] w-full bg-background border dark:border-gray-700/80 border-slate-300 p-4 rounded-2xl"
    >
      <div className="flex items-center justify-between flex-row-reverse">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-6 w-12 rounded-md" />
      </div>
      <Skeleton className="h-4 w-24 mt-2 rounded-md" />
    </div>
  ));
};

export default DoctorStatsCardsSkeleton;
