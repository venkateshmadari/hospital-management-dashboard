import { Card, CardContent, CardHeader } from "../ui/card";
import { doctorAvailability } from "@/types/single-doctor";

const DoctorAvailbility = ({ data }: { data: doctorAvailability[] }) => {
  const days = data?.map((availability) => availability.day);
  return (
    <Card className="bg-background rounded-3xl">
      <CardHeader>
        <h1 className="text-xl font-light">Driver avability</h1>
        <p className="text-sm text-muted-foreground">
          Detailed view of doctor shifts with timing
        </p>
      </CardHeader>
      <CardContent>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Avaliable days
          </p>
          <div className="flex">
            <p className="text-sm truncate">
              {days?.length} <span>{days?.length > 1 ? "days" : "day"}</span>
            </p>
            {days?.length > 0 && (
              <p className="text-sm ml-1">
                {days.map((day, index) => (
                  <span key={index} className="mr-2">
                    - {day}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
        <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-4 mt-6">
          {data?.map((avail) => (
            <div key={avail?.id} className="flex flex-col">
              <p className="truncate dark:text-purple-400 text-purple-600">
                {avail?.day}
              </p>
              <p className="text-sm text-muted-foreground">
                Start time - {avail.startTime}
              </p>
              <p className="text-sm text-muted-foreground">
                End time - {avail.endTime}
              </p>
              <p className="text-sm text-muted-foreground">
                Break start time - {avail.breakStartTime}
              </p>
              <p className="text-sm text-muted-foreground">
                Break end time - {avail.breakEndTime}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorAvailbility;
