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
import { DoctorsType } from "@/types/all-doctor";
import InlineLoader from "@/components/loaders/InlineLoader";

interface FormData {
  status: string;
}

const DoctorStatusChangeModal = ({
  open,
  onOpenChange,
  handleConfirm,
  error,
  isLoading,
  selectedDoctor,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  handleConfirm: any;
  error: string | null;
  isLoading: boolean;
  selectedDoctor: DoctorsType | null;
}) => {
  const { handleSubmit, setValue, reset } = useForm<FormData>({
    defaultValues: {
      status: selectedDoctor?.status,
    },
  });

  useEffect(() => {
    if (selectedDoctor) {
      setValue("status", selectedDoctor.status as string);
    } else {
      reset();
    }
  }, [selectedDoctor, setValue, reset]);

  const onSubmit = async (data: FormData) => {
    if (selectedDoctor) {
      await handleConfirm(selectedDoctor.id, data.status);
    }
  };

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
                defaultValue={selectedDoctor?.status}
              >
                <SelectTrigger id="status" className="w-full cursor-pointer">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE" className="cursor-pointer">
                    Active
                  </SelectItem>
                  <SelectItem value="INACTIVE" className="cursor-pointer">
                    In active
                  </SelectItem>
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

export default DoctorStatusChangeModal;
