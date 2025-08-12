import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const PersonalInformationSkeleton = () => {
  return (
    <Card className="bg-background rounded-3xl">
      <CardContent>
        <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-0 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
