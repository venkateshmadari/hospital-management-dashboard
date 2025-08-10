import React, { useMemo, useState } from "react";
import axiosInstance from "@/instance/instance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DoctorsType } from "@/types/all-doctor";
import toast from "react-hot-toast";
import TableSkeleton from "@/components/TableSkeleton";
import ErrorBlock from "@/components/ErrorBlock";
import PaginationComponent from "@/components/PaginationComponent";

interface DoctorsPageProps {
  doctors: DoctorsType[];
  onRefresh?: any;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: any;
}

const DoctorsPage: React.FC<DoctorsPageProps> = ({
  doctors,
  onRefresh,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [selectedDoctors, setSelectedDoctors] = useState<number[]>([]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // derived booleans
  const allSelected = useMemo(
    () => doctors.length > 0 && selectedDoctors.length === doctors.length,
    [doctors.length, selectedDoctors.length]
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDoctors(doctors.map((doc: any) => doc.id));
    } else {
      setSelectedDoctors([]);
    }
  };

  const handleSelectDoctor = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedDoctors((prev) => (prev.includes(id) ? prev : [...prev, id]));
    } else {
      setSelectedDoctors((prev) => prev.filter((docId) => docId !== id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedDoctors.length === 0) return;
    console.log(selectedDoctors);
    try {
      await axiosInstance.delete("/admin/doctors", {
        data: { ids: selectedDoctors },
      });

      toast.success("Selected doctors deleted successfully");
      setSelectedDoctors([]);
      onRefresh();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to delete"
      );
    }
  };

  const handleDeleteSingle = async (id: number) => {
    try {
      await axiosInstance.delete("/admin/doctors", { data: { ids: [id] } });
      toast.success("Doctor deleted");
      setSelectedDoctors((prev) => prev.filter((x) => x !== id));
      onRefresh();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <Card className="w-full space-y-4 bg-background">
      <CardContent>
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorBlock error={error} />
        ) : doctors.length > 0 ? (
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow className="py-4">
                  <TableHead className="w-8">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(checked) =>
                        handleSelectAll(checked as boolean)
                      }
                      className="cursor-pointer"
                    />
                  </TableHead>
                  <TableHead className="min-w-[200px] uppercase">
                    Doctor
                  </TableHead>
                  <TableHead className="min-w-[150px] uppercase">
                    Designation
                  </TableHead>
                  <TableHead className="min-w-[120px] uppercase">
                    Speciality
                  </TableHead>
                  <TableHead className="min-w-[100px] uppercase">
                    Status
                  </TableHead>
                  <TableHead className="min-w-[120px] uppercase">
                    Created
                  </TableHead>
                  <TableHead className="w-12">
                    {selectedDoctors.length > 0 && (
                      <div
                        onClick={handleDeleteSelected}
                        className="rounded-full inline-flex text-red-600 items-center gap-1 cursor-pointer"
                      >
                        {selectedDoctors.length}
                        <Trash2 size={15} />
                      </div>
                    )}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell className="sticky left-0 bg-background z-10">
                      <Checkbox
                        checked={selectedDoctors.includes(doctor.id)}
                        onCheckedChange={(checked) =>
                          handleSelectDoctor(doctor.id, checked as boolean)
                        }
                        className="cursor-pointer"
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={doctor.image || undefined}
                            alt={doctor.name}
                          />
                          <AvatarFallback className="text-xs">
                            {doctor.name?.slice(0, 1) ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{doctor.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {doctor.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {doctor.designation}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {doctor.speciality || "-"}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          doctor.status === "ACTIVE" ? "success" : "error"
                        }
                      >
                        {doctor.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(doctor.createdAt)}
                    </TableCell>

                    <TableCell className="sticky right-0 bg-background z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => console.log("View", doctor)}
                          >
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => console.log("Edit", doctor)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleDeleteSingle(doctor.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="min-h-52 flex items-center justify-center flex-col">
            <p className="text-2xl font-semibold text-primary">Oops!</p>
            <p className="text-center text-muted-foreground">
              No doctors found
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="-mt-3 flex items-center justify-end">
        {totalPages > 1 && (
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default DoctorsPage;
