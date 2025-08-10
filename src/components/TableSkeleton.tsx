import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

const TableSkeleton = () => {
  const skeletonRows = 20;

  return (
    <Card className="w-full space-y-4 p-4 bg-background">
      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow className="py-4">
                <TableHead className="w-8">
                  <Skeleton className="h-4 w-4" />
                </TableHead>
                <TableHead className="min-w-[200px]">
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead className="min-w-[150px]">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead className="min-w-[100px]">
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="w-12">
                  <Skeleton className="h-4 w-4" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: skeletonRows }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="sticky left-0 bg-background z-10">
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="sticky right-0 bg-background z-10">
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default TableSkeleton;
