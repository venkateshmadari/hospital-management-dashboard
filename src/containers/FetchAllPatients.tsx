import useFetchDataWithPagination from "@/hooks/useFetchDataWithPagination";
import axiosInstance from "@/instance/instance";
import PatientsPage from "@/pages/PatientsPage";
import { useState } from "react";

const FetchAllPatients = () => {
  const { data, isError, isLoading, pagination, handleItemsPerPageChange } =
    useFetchDataWithPagination("/admin/patients");
  console.log(data);
  return (
    <div>
      <PatientsPage
        loading={isLoading}
        error={isError}
        patients={data}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};

export default FetchAllPatients;
