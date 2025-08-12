
import DataCard from "@/components/doctorComponents/DataCard";

const SingleDoctorPage = ({ singleDoctor }: any) => {
  return (
    <div>
      <DataCard data={singleDoctor} />
    </div>
  );
};

export default SingleDoctorPage;
