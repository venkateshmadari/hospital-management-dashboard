import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RiLoopLeftLine } from "react-icons/ri";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { TotalAppointmentTypes } from "@/types/total-appointment";
import useFetchData from "@/hooks/useFetchData";
import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance from "@/instance/instance";
import toast from "react-hot-toast";
import InlineLoader from "../loaders/InlineLoader";
import ErrorBlock from "../ErrorBlock";

type DoctorDataTypes = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

type SlotType = {
  time: string;
  available: boolean;
};

type DoctorTimeSlots = {
  date: string;
  day: string;
  slots: SlotType[];
};

type SelectedSlot = {
  date: string;
  time: string;
};

const ReassignModal = ({
  open,
  onOpenChange,
  selectedAppointment,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  selectedAppointment: TotalAppointmentTypes | null;
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedDoctorData, setSelectedDoctorData] =
    useState<DoctorDataTypes | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [reassignLoading, setReassignLoading] = useState<boolean>(false);
  const [reassignError, setReassignError] = useState<string | null>(null);

  const apiUrl = selectedAppointment
    ? `/admin/rejected-appointments/speciality?speciality=${selectedAppointment?.doctor?.speciality}`
    : undefined;

  const timeSlotUrl = selectedDoctorId
    ? `/admin/rejected-appointments/timeslot/${selectedDoctorId}`
    : undefined;

  const {
    data: doctorData,
    isLoading: doctorsLoading,
    isError: doctorsError,
  } = useFetchData(apiUrl);

  const {
    data: doctorTimeSlots,
    isLoading: slotsLoading,
    isError: slotsError,
  } = useFetchData(timeSlotUrl);

  const handleDoctorChange = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    const doctor = doctorData?.find(
      (doc: DoctorDataTypes) => doc.id === doctorId
    );
    setSelectedDoctorData(doctor || null);
    setSelectedSlot(null);
  };

  const handleSlotSelection = (date: string, time: string) => {
    setSelectedSlot({ date, time });
  };

  const handleConfirm = async () => {
    if (!selectedDoctorId || !selectedSlot) {
      console.log("Doctor and slot must be selected");
      return;
    }
    console.log("Reassign Data:", {
      doctorId: selectedDoctorId,
      date: selectedSlot.date,
      startTime: selectedSlot.time,
    });
    setReassignLoading(true);
    setReassignError(null);
    try {
      const response = await axiosInstance.post(
        "/admin/rejected-appointments/reassign",
        {
          appointmentId: selectedAppointment?.id,
          oldDoctorId: selectedAppointment?.doctor?.id,
          newDoctorId: selectedDoctorId,
          date: selectedSlot.date,
          startTime: selectedSlot.time,
        }
      );
      if (response?.status === 201) {
        toast.success(response?.data?.message);
        onOpenChange(false);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      setReassignError(errorMessage);
    } finally {
      setReassignLoading(false);
    }
  };

  const datesScrollRef = useRef<HTMLDivElement | null>(null);
  const scrollDates = (delta: number) => {
    datesScrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-w-[95vw] w-full max-h-[85vh] dark:bg-black bg-white rounded-xl shadow-lg p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="font-light inline-flex items-center justify-center gap-2">
            <RiLoopLeftLine /> Reassign appointment
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0  px-6 pb-4 pt-2 space-y-4">
          {/* Doctor Selection */}
          <Select
            onValueChange={handleDoctorChange}
            value={selectedDoctorId || ""}
          >
            <SelectTrigger className="cursor-pointer w-full">
              {selectedDoctorData ? (
                <div className="inline-flex gap-2 p-1 rounded-lg items-center">
                  {selectedDoctorData?.image ? (
                    <img
                      src={selectedDoctorData?.image || "/placeholder.svg"}
                      alt={selectedDoctorData?.name}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-primary/15 text-primary uppercase flex items-center justify-center text-xs">
                      {selectedDoctorData?.name?.slice(0, 1)}
                    </div>
                  )}
                  <div>
                    <h1 className="text-sm capitalize">
                      {selectedDoctorData.name}
                    </h1>
                  </div>
                </div>
              ) : (
                <SelectValue placeholder="Select your doctor" />
              )}
            </SelectTrigger>
            <SelectContent className="w-full cursor-pointer">
              {doctorsLoading ? (
                <div className="space-y-2 p-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : doctorsError ? (
                <p className="py-5 text-sm text-center text-red-500">
                  Failed to load doctors
                </p>
              ) : doctorData?.length > 0 ? (
                doctorData?.map((doctor: DoctorDataTypes) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    <div className="inline-flex gap-2 p-2">
                      {doctor?.image ? (
                        <img
                          src={doctor?.image || "/placeholder.svg"}
                          alt={doctor?.name}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-primary/15 text-primary uppercase flex items-center justify-center">
                          {doctor?.name?.slice(0, 1)}
                        </div>
                      )}
                      <div className="hidden md:block">
                        <h1 className="text-sm capitalize">{doctor.name}</h1>
                        <p className="text-xs text-muted-foreground">
                          {doctor.email}
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <p className="py-5 text-sm text-center text-primary">
                  No doctors
                </p>
              )}
            </SelectContent>
          </Select>

          {/* Time Slot Selection */}
          {selectedDoctorId && (
            <div className="mt-2 overflow-hidden">
              {slotsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-lg" />
                    ))}
                  </div>
                </div>
              ) : slotsError ? (
                <p className="text-red-500">Failed to load slots</p>
              ) : doctorTimeSlots && doctorTimeSlots.length > 0 ? (
                <Tabs
                  defaultValue={doctorTimeSlots[0]?.date}
                  className="w-full"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="font-medium text-title">Select date</h2>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent cursor-pointer"
                        onClick={() => scrollDates(-240)}
                        aria-label="Previous dates"
                        type="button"
                      >
                        <FiChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent cursor-pointer"
                        onClick={() => scrollDates(240)}
                        aria-label="Next dates"
                        type="button"
                      >
                        <FiChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div
                    ref={datesScrollRef}
                    className="scrollbar-hide overflow-x-auto"
                  >
                    <TabsList className="mb-3 inline-flex min-w-max gap-2 px-1  h-auto">
                      {doctorTimeSlots.map((timeslot: DoctorTimeSlots) => (
                        <TabsTrigger
                          key={timeslot.date}
                          value={timeslot.date}
                          className="shrink-0 cursor-pointer whitespace-nowrap px-3 py-2 text-sm flex flex-col items-center"
                        >
                          <span className="text-sm font-medium">
                            {timeslot.date}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {timeslot.day}
                          </span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  {doctorTimeSlots.map((timeslot: DoctorTimeSlots) => (
                    <TabsContent
                      key={timeslot.date}
                      value={timeslot.date}
                      className="space-y-3"
                    >
                      <h1 className="font-medium text-title">
                        Select time slot
                      </h1>
                      {timeslot.slots?.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto scrollbar-hide">
                          {timeslot.slots.map((slot, idx) => (
                            <Button
                              key={idx}
                              type="button"
                              className="w-full cursor-pointer"
                              variant={
                                selectedSlot?.date === timeslot.date &&
                                selectedSlot?.time === slot.time
                                  ? "default"
                                  : "outline"
                              }
                              disabled={!slot.available}
                              onClick={() =>
                                handleSlotSelection(timeslot.date, slot.time)
                              }
                            >
                              {slot.time}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm py-3 text-muted-foreground text-center">
                          No time slots available for this day
                        </p>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  No time slots available
                </p>
              )}
            </div>
          )}
        </div>
        {reassignError && <ErrorBlock error={reassignError} />}
        <DialogFooter className="px-6 py-4 border-t flex items-center justify-center w-full gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className="text-white"
            onClick={handleConfirm}
            disabled={!selectedDoctorId || !selectedSlot || reassignLoading}
          >
            {reassignLoading ? (
              <div className="inline-flex gap-2">
                <InlineLoader />
                Reassigning...
              </div>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReassignModal;
