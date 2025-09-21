import { singlePatientAppointmentsTypes } from "@/types/single-patient";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import formatDate from "@/lib/formatDate";
import { Badge } from "../ui/badge";
import { AppointmentStatusVariant } from "@/lib/statusVariants";
import { formatCamelCase } from "@/lib/formatCamelCase";

const PatientAppointmentsData = ({
  data,
}: {
  data: singlePatientAppointmentsTypes[];
}) => {
  const endPoint = import.meta.env.VITE_PUBLIC_IMAGE_URL;
  return (
    <Card className="rounded-3xl bg-background">
      <CardHeader className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-light text-title">
            Patient Appointments
          </h1>
          <p className="text-sm text-muted-foreground">
            {data?.length > 0
              ? `Total ${data?.length} appointments`
              : "Detailed view of patient appointments"}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {data?.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((appointment) => (
              <Card
                key={appointment?.id}
                className="rounded-2xl border border-slate-300 dark:border-slate-800 transition dark:bg-black bg-white"
              >
                <CardHeader className="flex flex-row items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`${endPoint}${appointment?.doctor?.image || ""}`}
                    />
                    <AvatarFallback>
                      {appointment?.doctor?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base capitalize">
                      {appointment?.doctor?.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {appointment?.doctor?.email}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium capitalize">speciality:</span>
                    <span>
                      {formatCamelCase(appointment?.doctor?.speciality)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Date:</span>
                    <span>{formatDate(appointment?.date)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Time:</span>
                    <span>{appointment?.startTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Status:</span>
                    <Badge
                      variant={AppointmentStatusVariant(appointment?.status)}
                    >
                      {appointment?.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Created on:</span>
                    <span>{formatDate(appointment?.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <span className="text-xl font-medium text-title">Oops !</span>{" "}
            <br />
            No appointments found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientAppointmentsData;
