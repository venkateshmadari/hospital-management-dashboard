import { IoMdAddCircle } from "react-icons/io";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { doctorAvailability } from "@/types/single-doctor";
import { MdDelete, MdEdit } from "react-icons/md";

const DoctorAvailbility = ({
  data,
  heading,
  subheading,
  handleAddAvalibility,
  handleEditAvalibility,
  handleDeleteAvalibility,
}: {
  data: doctorAvailability[];
  heading?: string;
  subheading?: string;
  handleAddAvalibility?: () => void;
  handleEditAvalibility?: () => void;
  handleDeleteAvalibility?: () => void;
}) => {
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const orderedData = [...(data || [])].sort(
    (a, b) => weekDays.indexOf(a.day) - weekDays.indexOf(b.day)
  );

  const days = orderedData.map((availability) => availability.day);

  return (
    <Card
      className={`${
        handleAddAvalibility ? "dark:bg-black bg-white" : "bg-background"
      }  rounded-3xl h-full`}
    >
      <CardHeader className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-light text-title">
            {heading || "Doctor availability"}
          </h1>
          <p className="text-sm text-muted-foreground -mt-1">
            {subheading || "Detailed view of doctor shifts with timing"}
          </p>
        </div>
        <div className="space-x-2">
          {handleAddAvalibility && (
            <Button
              variant={"outline"}
              size="icon"
              onClick={handleAddAvalibility}
              className="cursor-pointer rounded-full"
            >
              <IoMdAddCircle className="text-title" />
            </Button>
          )}
          {handleEditAvalibility && (
            <Button
              variant={"outline"}
              size="icon"
              onClick={handleEditAvalibility}
              className="cursor-pointer rounded-full"
            >
              <MdEdit />
            </Button>
          )}
          {handleDeleteAvalibility && (
            <Button
              variant={"destructive"}
              size="icon"
              onClick={handleDeleteAvalibility}
              className="cursor-pointer rounded-full"
            >
              <MdDelete />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Available days
          </p>
          <div className="flex flex-wrap">
            <p className="text-sm truncate">
              {days?.length} <span>{days?.length > 1 ? "days" : "day"}</span>
            </p>
            {days?.length > 0 && (
              <p className="text-sm ml-2 flex flex-wrap">
                {orderedData.map((avail, index) => (
                  <span key={index} className="mr-2">
                    - {avail.day}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>

        <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-4 mt-6">
          {orderedData?.map((avail) => (
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
