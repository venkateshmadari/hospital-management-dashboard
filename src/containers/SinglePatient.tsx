import DoubleBreadcrumbs from "@/components/Breadcrumbs/DoubleBreadcrumbs";
import ErrorBlock from "@/components/ErrorBlock";
import PatientInfoCard from "@/components/patientComponents/PatientInfoCard";
import DataCardSkeleton from "@/components/skeletonLoadings/DataCardSkeleton";
import useFetchData from "@/hooks/useFetchData";
import { capitalizeFirstLetter } from "@/lib/capitalizeFirstLetter";
import React from "react";
import { useParams } from "react-router-dom";

const SinglePatient = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useFetchData(`/admin/patients/${id}`);
  console.log(data);
  return (
    <div>
      <div className="max-w-7xl w-auto mx-auto">
        <DoubleBreadcrumbs
          firstLink={"/patients"}
          firstName={"Patients"}
          secondName={capitalizeFirstLetter(data?.name) || id}
          isLoading={isLoading}
        />
        {isLoading ? (
          <div className="space-y-4">
            <DataCardSkeleton />
          </div>
        ) : isError ? (
          <ErrorBlock error={isError} />
        ) : (
          <div className="space-y-4">
            <PatientInfoCard data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePatient;
