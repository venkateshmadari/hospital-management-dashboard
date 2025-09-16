import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DoctorPermissionsTypes } from "@/types/single-doctor";
import { Button } from "../ui/button";
import { useState } from "react";
import EditDoctorPermissionModal from "../modals/EditDoctorPermissionModal";

const DoctorPermissions = ({
  data,
  doctorId,
}: {
  data: DoctorPermissionsTypes[];
  doctorId: string;
}) => {
  const [toggleModal, setToggleModal] = useState<boolean>(false);

  return (
    <>
      <Card className="rounded-3xl bg-background">
        <CardHeader className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-light text-title">
              Doctor Permissions
            </h1>
            <p className="text-sm text-muted-foreground">
              {data?.length > 0
                ? `Total ${data.length} permissions`
                : "No permissions assigned"}
            </p>
          </div>
          <Button
            className="cursor-pointer"
            onClick={() => setToggleModal(true)}
          >
            Edit Permissions
          </Button>
        </CardHeader>
        <CardContent>
          {data?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.map((perm) => (
                <span
                  key={perm.id}
                  className="px-3 py-1 text-sm rounded-full border shadow-sm hover:shadow-md transition"
                >
                  {perm.label}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No permissions available for this doctor.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Pass doctorId and current permissions */}
      <EditDoctorPermissionModal
        open={toggleModal}
        onClose={setToggleModal}
        doctorId={doctorId}
        currentPermissions={data}
      />
    </>
  );
};

export default DoctorPermissions;
