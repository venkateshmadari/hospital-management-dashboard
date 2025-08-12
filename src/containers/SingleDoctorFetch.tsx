import DoubleBreadcrumbs from "@/components/Breadcrumbs/DoubleBreadcrumbs";
import DataCard from "@/components/doctorComponents/DataCard";
import DoctorAvailbility from "@/components/doctorComponents/DoctorAvailbility";
import PersonalInformation from "@/components/doctorComponents/PersonalInformation";
import DataCardSkeleton from "@/components/skeletonLoadings/DataCardSkeleton";
import { DoctorAvailabilitySkeleton } from "@/components/skeletonLoadings/DoctorAvailabilitySkeleton";
import { PersonalInformationSkeleton } from "@/components/skeletonLoadings/PersonalInformationSkeleton ";
import useFetchData from "@/hooks/useFetchData";
import { capitalizeFirstLetter } from "@/lib/capitalizeFirstLetter";
import SingleDoctorPage from "@/pages/SingleDoctorPage";
import { useParams } from "react-router-dom";

const SingleDoctorFetch = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useFetchData(`/admin/doctors/${id}`);
  console.log(data, "dataaaa");
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
      ) : (
        <div className="space-y-4">
          <DataCard data={data} />
          <PersonalInformation data={data} />
          <DoctorAvailbility data={data?.Avability} />
        </div>
      )}
    </div>
  );
};

export default SingleDoctorFetch;
