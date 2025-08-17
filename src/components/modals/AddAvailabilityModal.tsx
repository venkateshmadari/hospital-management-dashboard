import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import ErrorBlock from "../ErrorBlock";
import InlineLoader from "../loaders/InlineLoader";

type AvailabilityForm = {
  startTime: string;
  endTime: string;
  breakStartTime: string;
  breakEndTime: string;
};

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AddAvailabilityModal({
  open,
  onClose,
  onSubmitAvailability,
  loading,
  error,
}: {
  open: boolean;
  onClose: any;
  onSubmitAvailability: (data: (AvailabilityForm & { day: string })[]) => void;
  loading: boolean;
  error: string | null;
}) {
  const { register, handleSubmit, reset }: any = useForm<AvailabilityForm>();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleFormSubmit = async (data: AvailabilityForm) => {
    if (selectedDays.length === 0) {
      toast.error("Please select at least one day.");
      return;
    }

    const availabilities = selectedDays.map((day) => ({
      ...data,
      day,
    }));

    await onSubmitAvailability(availabilities);
    reset();
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add Availability
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Timings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                {...register("startTime", { required: true })}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label>End Time</Label>
              <Input type="time" {...register("endTime", { required: true })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <Label>Break Start Time</Label>
              <Input
                type="time"
                {...register("breakStartTime", { required: true })}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label>Break End Time</Label>
              <Input
                type="time"
                {...register("breakEndTime", { required: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select Days</Label>
            <div className="grid grid-cols-2 gap-2">
              {weekDays.map((day) => (
                <label
                  key={day}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedDays.includes(day)}
                    onCheckedChange={() => toggleDay(day)}
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
          </div>
          {error && <ErrorBlock error={error} />}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="text-white cursor-pointer"
            >
              {loading ? <InlineLoader /> : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
