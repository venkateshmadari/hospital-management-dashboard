import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter } from "@/lib/capitalizeFirstLetter";
import { SingleDoctorTypes } from "@/types/single-doctor";
import { PatientType } from "@/types/all-patients";
import formatDate from "@/lib/formatDate";

const PatientInfoCard = ({ data }: { data: PatientType }) => {
  return (
    <Card className="bg-background rounded-3xl">
      <CardContent className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={data?.image}
            alt={data?.name}
            className="object-cover"
          />
          <AvatarFallback className="text-title uppercase">
            {data?.name?.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div className="overflow-hidden inline-flex items-center justify-between w-full">
          <div className="">
            <h1 className="capitalize text-lg truncate">
              {capitalizeFirstLetter(data?.name)}
            </h1>
            <p className="text-muted-foreground text-sm truncate">
              {data?.email}
            </p>
          </div>
          <div className="flex items-center flex-col gap-2">
            <div className="flex flex-col  text-sm">
              <h1 className="text-muted-foreground truncate mr-1.5">
                Created on :
              </h1>
              <p>{formatDate(data?.createdAt)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfoCard;
