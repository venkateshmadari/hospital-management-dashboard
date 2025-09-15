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
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import TableSkeleton from "@/components/TableSkeleton";
import ErrorBlock from "@/components/ErrorBlock";
import PaginationComponent from "@/components/PaginationComponent";
import { capitalizeFirstLetter } from "@/lib/capitalizeFirstLetter";
import formatDate from "@/lib/formatDate";
import { AppointmentStatusVariant } from "@/lib/statusVariants";
import { TotalAppointmentTypes } from "@/types/total-appointment";
import { formatCamelCase } from "@/lib/formatCamelCase";
import { RiLoopLeftLine } from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";

interface TotalAppointmentsPagePageProps {
  doctorAppointments: TotalAppointmentTypes[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  selectedAppointments: string[];
  setSelectedAppointments: React.Dispatch<React.SetStateAction<string[]>>;
  handleDeleteSingle: (id: string) => void;
  handleDeleteSelected: () => void;
  handleReassign: (value: TotalAppointmentTypes) => void;
}

const RejectedAppointmentsPage: React.FC<TotalAppointmentsPagePageProps> = ({
  doctorAppointments,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  selectedAppointments = [],
  setSelectedAppointments,
  handleDeleteSingle,
  handleDeleteSelected,
  handleReassign,
}) => {
  const { permissions } = useAuth();
  const allSelected = useMemo(
    () =>
      doctorAppointments?.length > 0 &&
      selectedAppointments?.length === doctorAppointments?.length,
    [doctorAppointments?.length, selectedAppointments?.length]
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAppointments(doctorAppointments.map((doc) => doc.id));
    } else {
      setSelectedAppointments([]);
    }
  };

  const handleSelectAppointment = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedAppointments((prev) => [...prev, id]);
    } else {
      setSelectedAppointments((prev) => prev.filter((docId) => docId !== id));
    }
  };
  const hasReassignPermission = permissions.some(
    (prem) => prem.name === "REASSIGN_REJECTED_APPOINTMENTS"
  );

  const hasDeletePermission = permissions.some(
    (prem) => prem.name === "DELETE_REJECTED_APPOINTMENTS"
  );

  return (
    <Card className="w-full space-y-4 bg-background">
      <CardContent>
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorBlock error={error} />
        ) : doctorAppointments.length > 0 ? (
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow className="py-4">
                  {hasDeletePermission && (
                    <TableHead className="w-8">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={(checked) =>
                          handleSelectAll(checked as boolean)
                        }
                        className="cursor-pointer"
                      />
                    </TableHead>
                  )}
                  <TableHead className="min-w-[200px] uppercase">
                    Patient
                  </TableHead>
                  <TableHead className="min-w-[200px] uppercase">
                    Doctor
                  </TableHead>
                  <TableHead className="min-w-[150px] uppercase">
                    Date & Time
                  </TableHead>
                  <TableHead className="min-w-[100px] uppercase">
                    Status
                  </TableHead>
                  <TableHead className="min-w-[120px] uppercase">
                    Created on
                  </TableHead>
                  {hasDeletePermission && (
                    <TableHead className="w-12">
                      {selectedAppointments.length > 0 && (
                        <div
                          onClick={handleDeleteSelected}
                          className="rounded-full inline-flex text-red-600 items-center gap-1 cursor-pointer"
                        >
                          {selectedAppointments.length}
                          <Trash2 size={15} />
                        </div>
                      )}
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctorAppointments.map(
                  (appointment: TotalAppointmentTypes) => (
                    <TableRow key={appointment.id}>
                      {hasDeletePermission && (
                        <TableCell className="sticky left-0 bg-background z-10">
                          <Checkbox
                            checked={selectedAppointments.includes(
                              appointment.id
                            )}
                            onCheckedChange={(checked) =>
                              handleSelectAppointment(
                                appointment.id,
                                checked as boolean
                              )
                            }
                            className="cursor-pointer"
                          />
                        </TableCell>
                      )}

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={appointment.patient.image || undefined}
                              alt={appointment.patient.name}
                              className="object-cover"
                            />
                            <AvatarFallback className="text-xs uppercase">
                              {appointment.patient.name?.slice(0, 1) ?? "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {capitalizeFirstLetter(appointment.patient.name)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {appointment?.patient?.phoneNumber
                                ? appointment?.patient?.phoneNumber
                                : appointment.patient.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={appointment.doctor.image || undefined}
                              alt={appointment.doctor.name}
                              className="object-cover"
                            />
                            <AvatarFallback className="text-xs uppercase">
                              {appointment.doctor.name?.slice(0, 1) ?? "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {capitalizeFirstLetter(appointment.doctor.name)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatCamelCase(appointment?.doctor?.speciality)}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {appointment.startTime} <br />
                        <span className="text-muted-foreground">
                          {formatDate(appointment.date)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={AppointmentStatusVariant(appointment.status)}
                          className="capitalize"
                        >
                          {appointment.status?.toLowerCase()}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(appointment.createdAt)}
                      </TableCell>
                      {(hasReassignPermission || hasDeletePermission) && (
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
                              {hasReassignPermission && (
                                <DropdownMenuItem
                                  onClick={() => handleReassign(appointment)}
                                  className="cursor-pointer font-medium text-title"
                                >
                                  <RiLoopLeftLine className="mr-2 h-4 w-4 text-title" />{" "}
                                  Reassign
                                </DropdownMenuItem>
                              )}
                              {hasDeletePermission && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteSingle(appointment.id)
                                  }
                                  className="text-red-600 cursor-pointer font-medium"
                                >
                                  <Trash2 className="mr-2 h-4 w-4 text-red-600 " />{" "}
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="min-h-52 flex items-center justify-center flex-col">
            <p className="text-2xl font-semibold text-title">Oops!</p>
            <p className="text-center text-muted-foreground">
              No rejected appointments
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

export default RejectedAppointmentsPage;
