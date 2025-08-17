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
import toast from "react-hot-toast";
import TableSkeleton from "@/components/TableSkeleton";
import ErrorBlock from "@/components/ErrorBlock";
import PaginationComponent from "@/components/PaginationComponent";
import { Link } from "react-router-dom";
import { capitalizeFirstLetter } from "@/lib/capitalizeFirstLetter";
import formatDate from "@/lib/formatDate";

const PatientsPage = ({
  loading,
  error,
  patients,
  currentPage,
  totalPages,
  onPageChange,
}: {
  loading: boolean;
  error: string | null;
  patients: any[];
  currentPage: number;
  totalPages: number;
  onPageChange: any;
}) => {
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);

  const allSelected = useMemo(
    () => patients.length > 0 && selectedPatients.length === patients.length,
    [patients.length, selectedPatients.length]
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPatients(patients.map((pat) => pat.id));
    } else {
      setSelectedPatients([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedPatients.length === 0) return;

    try {
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      toast.error(errorMessage);
    }
  };

  const handleSelectPatient = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPatients((prev) => (prev.includes(id) ? prev : [...prev, id]));
    } else {
      setSelectedPatients((prev) => prev.filter((patId) => patId !== id));
    }
  };

  const handleDeleteSingle = (id: string) => {
    console.log(id);
  };
  return (
    <Card className="w-full space-y-4 bg-background">
      <CardContent>
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorBlock error={error} />
        ) : patients.length > 0 ? (
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
                    Name
                  </TableHead>
                  <TableHead className="min-w-[150px] uppercase">
                    Email
                  </TableHead>
                  <TableHead className="min-w-[120px] uppercase">
                    Created
                  </TableHead>
                  <TableHead className="w-12">
                    {selectedPatients.length > 0 && (
                      <div
                        onClick={handleDeleteSelected}
                        className="rounded-full inline-flex text-red-600 items-center gap-1 cursor-pointer"
                      >
                        {selectedPatients.length}
                        <Trash2 size={15} />
                      </div>
                    )}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="sticky left-0 bg-background z-10">
                      <Checkbox
                        checked={selectedPatients.includes(patient.id)}
                        onCheckedChange={(checked) =>
                          handleSelectPatient(patient.id, checked as boolean)
                        }
                        className="cursor-pointer"
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={patient.image || undefined}
                            alt={patient.name}
                          />
                          <AvatarFallback className="text-xs uppercase">
                            {patient.name?.slice(0, 1) ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {capitalizeFirstLetter(patient.name)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {patient.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {patient.email}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(patient.createdAt)}
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
                          <Link to={`/doctors/${patient?.id}`}>
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>
                          </Link>

                          <DropdownMenuItem
                            onClick={() => console.log("Edit", patient)}
                            className="cursor-pointer"
                          >
                            <MdEdit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleDeleteSingle(patient.id)}
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
              No patients found
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

export default PatientsPage;
