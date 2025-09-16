import DoubleBreadcrumbs from "@/components/Breadcrumbs/DoubleBreadcrumbs";
import DataCard from "@/components/doctorComponents/DataCard";
import DoctorAppointmentsData from "@/components/doctorComponents/DoctorAppointmentsData";
import DoctorAvailbility from "@/components/doctorComponents/DoctorAvailbility";
import DoctorPermissions from "@/components/doctorComponents/DoctorPermissions";
import PersonalInformation from "@/components/doctorComponents/PersonalInformation";
import ErrorBlock from "@/components/ErrorBlock";
import DataCardSkeleton from "@/components/skeletonLoadings/DataCardSkeleton";
import { DoctorAvailabilitySkeleton } from "@/components/skeletonLoadings/DoctorAvailabilitySkeleton";
import { PersonalInformationSkeleton } from "@/components/skeletonLoadings/PersonalInformationSkeleton ";
import useFetchData from "@/hooks/useFetchData";
import { capitalizeFirstLetter } from "@/lib/capitalizeFirstLetter";
import { useParams } from "react-router-dom";

const SingleDoctorFetch = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useFetchData(`/admin/doctors/${id}`);
  console.log(data);
  return (
    <div className="max-w-7xl w-auto mx-auto">
      <DoubleBreadcrumbs
        firstLink={"/doctors"}
        firstName={"Doctor"}
        secondName={capitalizeFirstLetter(data?.name) || id}
        isLoading={isLoading}
      />
      {isLoading ? (
        <div className="space-y-4">
          <DataCardSkeleton />
          <PersonalInformationSkeleton />
          <DoctorAvailabilitySkeleton />
        </div>
      ) : isError ? (
        <ErrorBlock error={isError} />
      ) : (
        <div className="space-y-4">
          <DataCard data={data} />
          <PersonalInformation data={data} />
          <DoctorAvailbility data={data?.Avability} />
          <DoctorAppointmentsData data={data?.Appointment} />
          <DoctorPermissions
            data={data?.DoctorPermissions}
            doctorId={data?.id}
          />
        </div>
      )}
    </div>
  );
};

export default SingleDoctorFetch;
