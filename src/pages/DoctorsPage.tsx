import React, { useMemo } from "react";
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
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { MdEdit } from "react-icons/md";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DoctorsType } from "@/types/all-doctor";
import TableSkeleton from "@/components/TableSkeleton";
import ErrorBlock from "@/components/ErrorBlock";
import PaginationComponent from "@/components/PaginationComponent";
import { Link } from "react-router-dom";
import { capitalizeFirstLetter } from "@/lib/capitalizeFirstLetter";
import { formatCamelCase } from "@/lib/formatCamelCase";
import formatDate from "@/lib/formatDate";

interface DoctorsPageProps {
  doctors: DoctorsType[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  selectedDoctors: string[];
  setSelectedDoctors: React.Dispatch<React.SetStateAction<string[]>>;
  handleDeleteSingle: (id: string) => void;
  handleDeleteSelected: () => void;
}

const DoctorsPage: React.FC<DoctorsPageProps> = ({
  doctors,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  selectedDoctors = [],
  setSelectedDoctors,
  handleDeleteSingle,
  handleDeleteSelected,
}) => {
  const allSelected = useMemo(
    () => doctors?.length > 0 && selectedDoctors?.length === doctors?.length,
    [doctors?.length, selectedDoctors?.length]
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDoctors(doctors.map((doc) => doc.id));
    } else {
      setSelectedDoctors([]);
    }
  };

  const handleSelectDoctor = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedDoctors((prev) => [...prev, id]);
    } else {
      setSelectedDoctors((prev) => prev.filter((docId) => docId !== id));
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
                    Details
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
                          <AvatarFallback className="text-xs uppercase">
                            {doctor.name?.slice(0, 1) ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {capitalizeFirstLetter(doctor.name)}
                          </span>
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
                      {formatCamelCase(doctor.speciality) || "-"}
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
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 cursor-pointer"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <Link to={`/doctors/${doctor?.id}`}>
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>
                          </Link>

                          <DropdownMenuItem
                            onClick={() => console.log("Edit", doctor)}
                            className="cursor-pointer"
                          >
                            <MdEdit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleDeleteSingle(doctor.id)}
                            className="text-red-600 cursor-pointer font-medium"
                          >
                            <Trash2 className="mr-2 h-4 w-4 text-red-600 " />{" "}
                            Delete
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