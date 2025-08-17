import React from "react";
import { Card, CardContent } from "../ui/card";
import { SingleDoctorTypes } from "@/types/single-doctor";
import formatDate from "@/lib/formatDate";
import { formatCamelCase } from "@/lib/formatCamelCase";

const PersonalInformation = ({ data }: { data: SingleDoctorTypes }) => {
  return (
    <Card className="bg-background rounded-3xl">
      <CardContent>
        <div className="grid xl:grid-cols-4 md:grid-cols-2">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              {" "}
              Created on
            </p>
            <p className="text-sm truncate">{formatDate(data?.createdAt)}</p>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              Designation
            </p>
            <p className="text-sm truncate">{data?.designation}</p>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              Speciality
            </p>
            <p className="text-sm truncate">
              {formatCamelCase(data?.speciality)}
            </p>
          </div>
          {data?.description && (
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                Description
              </p>
              <p className="text-sm line-clamp-4">{data?.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformation;
