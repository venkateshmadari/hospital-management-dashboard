import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import ErrorBlock from "../ErrorBlock";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import InlineLoader from "@/components/loaders/InlineLoader";
import { AppointmentTypes } from "@/types/appointments";

interface FormData {
  status: string;
}

const AppointmentStatusChangeModal = ({
  open,
  onOpenChange,
  handleConfirm,
  error,
  isLoading,
  selectedAppointment,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  handleConfirm: any;
  error: string | null;
  isLoading: boolean;
  selectedAppointment: AppointmentTypes | null;
}) => {
  const { handleSubmit, setValue, reset } = useForm<FormData>({
    defaultValues: {
      status: selectedAppointment?.status,
    },
  });

  useEffect(() => {
    if (selectedAppointment) {
      setValue("status", selectedAppointment.status as string);
    } else {
      reset();
    }
  }, [selectedAppointment, setValue, reset]);

  const onSubmit = async (data: FormData) => {
    if (selectedAppointment) {
      await handleConfirm(selectedAppointment.id, data.status);
    }
  };

  const statusItems = [
    { id: 1, value: "PENDING", label: "Pending" },
    {
      id: 2,
      value: "ACCEPTED",
      label: "Accepted",
    },
    {
      id: 3,
      value: "REJECTED",
      label: "Rejected",
    },
    {
      id: 4,
      value: "COMPLETED",
      label: "Completed",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md dark:bg-black border bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="font-medium">Edit Status</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 mt-4">
            <div>
              <Label htmlFor="status" className="text-muted-foreground mb-2">
                Status
              </Label>
              <Select
                onValueChange={(value: string) =>
                  setValue("status", value, { shouldValidate: true })
                }
                defaultValue={selectedAppointment?.status}
              >
                <SelectTrigger id="status" className="w-full cursor-pointer">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusItems.map((data) => (
                    <SelectItem
                      key={data.id}
                      value={data.value}
                      className="cursor-pointer"
                    >
                      {data.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <ErrorBlock error={error} />}

          <DialogFooter className="mt-5 flex items-center justify-end flex-row w-full gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="cursor-pointer text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <InlineLoader />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentStatusChangeModal;
