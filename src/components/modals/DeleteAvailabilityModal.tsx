import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import InlineLoader from "../loaders/InlineLoader";

// Define the correct day order
const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface Availability {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface DeleteAvailabilityModalProps {
  open: boolean;
  onClose: () => void;
  availabilities: Availability[];
  handleDelete: (ids: string[]) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const DeleteAvailabilityModal: React.FC<DeleteAvailabilityModalProps> = ({
  open,
  onClose,
  availabilities,
  handleDelete,
  loading,
  error,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Sort availabilities by day order
  const sortedAvailabilities = [...availabilities].sort((a, b) => {
    return DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day);
  });

  const handleCheckboxChange = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedIds.length === 0) {
      return;
    }
    await handleDelete(selectedIds);
    if (!error) {
      setSelectedIds([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Delete Availability
          </DialogTitle>
        </DialogHeader>

        {sortedAvailabilities.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            No availabilities to delete
          </p>
        ) : (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {sortedAvailabilities.map((availability) => (
                <div
                  key={availability.id}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={availability.id}
                    checked={selectedIds.includes(availability.id)}
                    onCheckedChange={() =>
                      handleCheckboxChange(availability.id)
                    }
                    className="cursor-pointer"
                  />
                  <Label
                    htmlFor={availability.id}
                    className="flex-1 text-muted-foreground cursor-pointer"
                  >
                    {availability.day}: {availability.startTime} -{" "}
                    {availability.endTime}
                  </Label>
                </div>
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full mt-3 text-white"
              disabled={loading || selectedIds.length === 0}
              variant={selectedIds.length > 0 ? "destructive" : "default"}
            >
              {loading ? (
                <div className="inline-flex gap-2">
                  <InlineLoader />
                  Deleting...
                </div>
              ) : (
                `Delete Selected (${selectedIds.length})`
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAvailabilityModal;
