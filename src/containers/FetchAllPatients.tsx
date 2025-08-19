import DeleteModal from "@/components/modals/DeleteModal";
import SearchInput from "@/components/SearchInput";
import useFetchData from "@/hooks/useFetchData";
import useFetchDataWithPagination from "@/hooks/useFetchDataWithPagination";
import axiosInstance from "@/instance/instance";
import PatientsPage from "@/pages/PatientsPage";
import DoctorStatsCards from "@/stats/DoctorStatsCards";
import { PatientType } from "@/types/all-patients";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUserFriends } from "react-icons/fa";
import { FaUserClock } from "react-icons/fa6";
import { useNavigate, useSearchParams } from "react-router-dom";
interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const FetchAllPatients = () => {
  const [isLoading, setIsLoading] = useState<{
    fetch: boolean;
    delete: boolean;
  }>({
    fetch: false,
    delete: false,
  });
  const [isError, setIsError] = useState<{
    fetch: string | null;
    delete: string | null;
  }>({
    fetch: null,
    delete: null,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [allPatients, setAllPatients] = useState<PatientType[]>([]);
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { data: patientStats } = useFetchData("/admin/patients/stats");

  const getPatients = useCallback(async () => {
    setIsLoading((prev) => ({
      ...prev,
      fetch: true,
    }));
    setIsError((prev) => ({
      ...prev,
      fetch: null,
    }));
    try {
      const queryParams = new URLSearchParams({
        limit: pagination.itemsPerPage.toString(),
        page: pagination.currentPage.toString(),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await axiosInstance.get(
        `/admin/patients?${queryParams}`
      );

      if (response?.status === 200) {
        setAllPatients(response.data?.data || []);
        setPagination((prev) => ({
          ...prev,
          currentPage: response.data?.pagination?.currentPage || 1,
          totalPages: response.data?.pagination?.totalPages || 1,
          totalItems: response.data?.pagination?.totalItems || 0,
          hasNextPage: response.data?.pagination?.hasNextPage || false,
          hasPreviousPage: response.data?.pagination?.hasPreviousPage || false,
        }));
      } else {
        setIsError((prev) => ({
          ...prev,
          fetch: "Failed to fetch doctors",
        }));
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unknown error";
      setIsError((prev) => ({
        ...prev,
        fetch: errorMessage,
      }));
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        fetch: false,
      }));
    }
  }, [searchQuery, pagination.currentPage, pagination.itemsPerPage]);

  useEffect(() => {
    getPatients();
  }, [getPatients]);

  const stats = [
    {
      icon: <FaUserFriends />,
      count: patientStats?.patientsCount,
      text: "Total Patients",
      color: "bg-emerald-500",
    },
    {
      icon: <FaUserClock />,
      count: patientStats?.thisMonthPatients,
      text: "Current Month Patients",
      color: "bg-cyan-500",
    },
  ];
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    const newParams = new URLSearchParams(searchParams);
    navigate(newParams.toString() ? `?${newParams.toString()}` : "");
  };

  const handleDeleteSingle = (id: string) => {
    setSelectedPatients([id]);
    setToggleModal(true);
  };

  const handleDeleteSelected = () => {
    if (selectedPatients.length === 0) {
      toast.error("No patients selected");
      return;
    }
    setToggleModal(true);
  };
  const handleCloseDeleteModal = () => {
    setToggleModal(false);
    setIsError((prev) => ({ ...prev, delete: null }));
  };
  const handleConfirmDelete = async () => {
    setIsLoading((prev) => ({
      ...prev,
      delete: true,
    }));
    setIsError((prev) => ({ ...prev, delete: null }));
    try {
      const response = await axiosInstance.delete("/admin/patients", {
        data: { patientIds: selectedPatients },
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        setToggleModal(false);
        setAllPatients((prev) =>
          prev.filter((doctor) => !selectedPatients.includes(doctor.id))
        );
        setPagination((prev) => ({
          ...prev,
          totalItems: prev.totalItems - selectedPatients.length,
          totalPages: Math.ceil(
            (prev.totalItems - selectedPatients.length) / prev.itemsPerPage
          ),
        }));
        setSelectedPatients([]);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unknown error";
      setIsError((prev) => ({ ...prev, delete: errorMessage }));
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: false }));
    }
  };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {stats.map((stat, index) => (
          <DoctorStatsCards
            key={index}
            icon={stat.icon}
            count={stat.count}
            text={stat.text}
            color={stat.color}
          />
        ))}
      </div>
      <div className="flex items-center justify-end mb-5">
        <SearchInput placeholder="Search patients" />
      </div>
      <PatientsPage
        loading={isLoading.fetch}
        error={isError.fetch}
        patients={allPatients}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        selectedPatients={selectedPatients}
        setSelectedPatients={setSelectedPatients}
        handleDeleteSingle={handleDeleteSingle}
        handleDeleteSelected={handleDeleteSelected}
      />
      <DeleteModal
        open={toggleModal}
        onOpenChange={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        error={isError.delete}
        DeleteLoading={isLoading.delete}
      />
    </div>
  );
};

export default FetchAllPatients;
