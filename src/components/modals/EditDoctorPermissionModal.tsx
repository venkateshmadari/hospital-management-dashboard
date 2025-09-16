import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import useFetchData from "@/hooks/useFetchData";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/instance/instance";
import InlineLoader from "../loaders/InlineLoader";
import ErrorBlock from "../ErrorBlock";
import { Skeleton } from "../ui/skeleton";

interface Permission {
  id: number;
  name: string;
  label: string;
}

const EditDoctorPermissionModal = ({
  open,
  onClose,
  doctorId,
  currentPermissions,
}: {
  open: boolean;
  onClose: (open: boolean) => void;
  doctorId: string;
  currentPermissions: Permission[];
}) => {
  const {
    data: allPermissions,
    isLoading,
    isError,
  } = useFetchData("/admin/permission/all");

  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [isPostError, setIsPostError] = useState<string | null>(null);
  const [isPostLoading, setIsPostLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentPermissions) {
      setSelectedPerms(currentPermissions.map((p: Permission) => p.name));
    }
  }, [currentPermissions]);

  const togglePermission = (permName: string, checked: boolean) => {
    if (checked) {
      setSelectedPerms((prev) => [...prev, permName]);
    } else {
      setSelectedPerms((prev) => prev.filter((p) => p !== permName));
    }
  };

  const handleConfirm = async () => {
    console.log(selectedPerms, "selectedPerms");
    setIsPostLoading(true);
    setIsPostError(null);
    try {
      const res = await axiosInstance.post(
        `/admin/permission/${doctorId}/permissions`,
        {
          permissions: selectedPerms,
        }
      );
      if (res?.status === 200) {
        toast.success(res?.data?.message);
        onClose(false);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      setIsPostError(errorMessage);
    } finally {
      setIsPostLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-light text-title">
            Edit permissions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between border p-2 rounded-md dark:bg-gray-950"
              >
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-5 w-10 rounded-full" />
              </div>
            ))
          ) : isError ? (
            <ErrorBlock error={isError} />
          ) : (
            allPermissions?.map((perm: Permission) => (
              <div
                key={perm.id}
                className="flex items-center justify-between border p-2 rounded-md dark:bg-gray-950"
              >
                <span className="text-sm">{perm.label}</span>
                <Switch
                  checked={selectedPerms.includes(perm.name)}
                  onCheckedChange={(checked) =>
                    togglePermission(perm.name, checked)
                  }
                  className="cursor-pointer"
                />
              </div>
            ))
          )}
        </div>
        <ErrorBlock error={isPostError} />
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => onClose(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="cursor-pointer">
            {isPostLoading ? (
              <>
                <InlineLoader /> Please wait
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDoctorPermissionModal;
