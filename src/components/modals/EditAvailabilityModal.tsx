// EditAvailabilityModal.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import InlineLoader from "../loaders/InlineLoader";

type AvailabilityForm = {
  startTime: string;
  endTime: string;
  breakStartTime: string;
  breakEndTime: string;
};

interface EditAvailabilityModalProps {
  open: boolean;
  onClose: () => void;
  availabilities: any[];
  handleConfirmEdit: (data: {
    day: string;
    startTime: string;
    endTime: string;
    breakStartTime: string;
    breakEndTime: string;
  }) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
}

const EditAvailabilityModal: React.FC<EditAvailabilityModalProps> = ({
  open,
  onClose,
  availabilities,
  handleConfirmEdit,
  loading,
  error,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>("");

  const { register, handleSubmit, reset } = useForm<AvailabilityForm>({
    defaultValues: {
      startTime: "",
      endTime: "",
      breakStartTime: "",
      breakEndTime: "",
    },
  });

  // When user selects a day, reset form with that day's values
  const handleDayChange = (day: string) => {
    setSelectedDay(day);
    const availability = availabilities.find((a: any) => a.day === day);

    if (availability) {
      reset({
        startTime: availability.startTime || "",
        endTime: availability.endTime || "",
        breakStartTime: availability.breakStartTime || "",
        breakEndTime: availability.breakEndTime || "",
      });
    } else {
      reset({
        startTime: "",
        endTime: "",
        breakStartTime: "",
        breakEndTime: "",
      });
    }
  };

  const onSubmit = async (data: AvailabilityForm) => {
    if (!selectedDay) return;

    await handleConfirmEdit({
      day: selectedDay,
      ...data,
    });

    if (!error) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Edit Availability
          </DialogTitle>
        </DialogHeader>

        {availabilities.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            No data to edit the availabilities
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Day dropdown */}
            <Select onValueChange={handleDayChange} value={selectedDay}>
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {availabilities.map((a: any) => (
                  <SelectItem key={a.id} value={a.day}>
                    {a.day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedDay && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Start Time</label>
                    <Input type="time" {...register("startTime")} />
                  </div>

                  <div>
                    <label className="text-sm font-medium">End Time</label>
                    <Input type="time" {...register("endTime")} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Break Start</label>
                    <Input type="time" {...register("breakStartTime")} />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Break End</label>
                    <Input type="time" {...register("breakEndTime")} />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full mt-3 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="inline-flex gap-2">
                      <InlineLoader />
                      Saving...
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditAvailabilityModal;
