import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/instance/instance";
import { DoctorsType } from "@/types/all-doctor";
import Preloader from "@/components/loaders/Preloader";
import DoctorFilters from "@/pages/filters/DoctorFilters";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaginationComponent from "@/components/PaginationComponent";
import {
  RiStethoscopeFill,
  RiUserHeartFill,
  RiUserUnfollowFill,
} from "react-icons/ri";
import DoctorStatsCards from "@/stats/DoctorStatsCards";
import useFetchData from "@/hooks/useFetchData";
import DeleteModal from "@/components/modals/DeleteModal";
import toast from "react-hot-toast";
import DoctorStatusChangeModal from "@/components/modals/DoctorStatusChangeModal";
import DoctorsPage from "@/pages/DoctorsPage";

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const FetchAllDoctors: React.FC = () => {
  const [loading, setLoading] = useState({
    fetch: false,
    edit: false,
    delete: false,
  });
  const [isError, setIsError] = useState({
    fetch: null as string | null,
    edit: null as string | null,
    delete: null as string | null,
  });
  const [doctors, setDoctors] = useState<DoctorsType[]>([]);
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
  const [selectedEditDoctor, setSelectedEditDoctor] =
    useState<DoctorsType | null>(null);
  const [toggleModal, setToggleModal] = useState({
    delete: false,
    edit: false,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "";
  const specialityFilter = searchParams.get("speciality") || "";
  const { data } = useFetchData("/admin/doctors/stats");

  const getDoctors = useCallback(async () => {
    setLoading((prev) => ({ ...prev, fetch: true }));
    setIsError((prev) => ({ ...prev, fetch: null }));
    try {
      const queryParams = new URLSearchParams({
        limit: pagination.itemsPerPage.toString(),
        page: pagination.currentPage.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter && statusFilter !== "all" && { status: statusFilter }),
        ...(specialityFilter &&
          specialityFilter !== "all" && { speciality: specialityFilter }),
      });

      const response = await axiosInstance.get(`/admin/doctors?${queryParams}`);

      if (response?.status === 200) {
        setDoctors(response.data?.data || []);
        setPagination((prev) => ({
          ...prev,
          currentPage: response.data?.pagination?.currentPage || 1,
          totalPages: response.data?.pagination?.totalPages || 1,
          totalItems: response.data?.pagination?.totalItems || 0,
          hasNextPage: response.data?.pagination?.hasNextPage || false,
          hasPreviousPage: response.data?.pagination?.hasPreviousPage || false,
        }));
      } else {
        setIsError((prev) => ({ ...prev, fetch: "Failed to fetch doctors" }));
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unknown error";
      setIsError((prev) => ({ ...prev, fetch: errorMessage }));
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  }, [
    searchQuery,
    statusFilter,
    specialityFilter,
    pagination.currentPage,
    pagination.itemsPerPage,
  ]);

  useEffect(() => {
    getDoctors();
  }, [getDoctors]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    const newParams = new URLSearchParams(searchParams);
    navigate(newParams.toString() ? `?${newParams.toString()}` : "");
  };

  const handleFilter = (filterType: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "all") {
      newParams.delete(filterType);
    } else {
      newParams.set(filterType, value);
    }
    navigate(newParams.toString() ? `?${newParams.toString()}` : "");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const filterOptions = [
    { id: 1, name: "All Status", value: "all" },
    { id: 2, name: "Active", value: "ACTIVE" },
    { id: 3, name: "Inactive", value: "INACTIVE" },
  ];

  const stats = [
    {
      icon: <RiStethoscopeFill />,
      count: data?.totalDoctors,
      text: "Total doctors",
      color: "bg-emerald-500",
    },
    {
      icon: <RiUserHeartFill />,
      count: data?.activeDoctors,
      text: "Active doctors",
      color: "bg-cyan-500",
    },
    {
      icon: <RiUserUnfollowFill />,
      count: data?.inActiveDoctors,
      text: "Inactive doctors",
      color: "bg-violet-500",
    },
  ];

  const handleDeleteSingle = (id: string) => {
    setSelectedDoctors([id]);
    setToggleModal((prev) => ({ ...prev, delete: true }));
  };

  const handleDeleteSelected = () => {
    if (selectedDoctors.length === 0) {
      toast.error("No doctors selected");
      return;
    }
    setToggleModal((prev) => ({ ...prev, delete: true }));
  };

  const handleConfirmDelete = async () => {
    if (selectedDoctors.length === 0) return;

    setLoading((prev) => ({ ...prev, delete: true }));
    setIsError((prev) => ({ ...prev, delete: null }));

    try {
      const response = await axiosInstance.delete("/admin/doctors", {
        data: { doctorIds: selectedDoctors },
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setToggleModal((prev) => ({ ...prev, delete: false }));
        setDoctors((prev) =>
          prev.filter((doctor) => !selectedDoctors.includes(doctor.id))
        );
        setPagination((prev) => ({
          ...prev,
          totalItems: prev.totalItems - selectedDoctors.length,
          totalPages: Math.ceil(
            (prev.totalItems - selectedDoctors.length) / prev.itemsPerPage
          ),
        }));
        setSelectedDoctors([]);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to delete doctors";
      setIsError((prev) => ({ ...prev, delete: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  const handleCloseDeleteModal = () => {
    setToggleModal((prev) => ({ ...prev, delete: false }));
    setIsError((prev) => ({ ...prev, delete: null }));
  };

  const handleCloseEditModal = () => {
    setToggleModal((prev) => ({ ...prev, edit: false }));
    setIsError((prev) => ({ ...prev, edit: null }));
  };
  const handleEditDoctor = (data: DoctorsType) => {
    setToggleModal((prev) => ({
      ...prev,
      edit: true,
    }));
    setSelectedEditDoctor(data);
  };

  const confirmEditChange = async (id: string, status: string) => {
    console.log(id, status);
    setLoading((prev) => ({ ...prev, edit: true }));
    setIsError((prev) => ({ ...prev, edit: null }));
    try {
      const response = await axiosInstance.put(`/admin/doctors/status/${id}`, {
        status,
      });
      console.log(response, "resssssssssss");
      if (response.status === 200) {
        setToggleModal((prev) => ({
          ...prev,
          edit: false,
        }));
        const updatedDoctor = response.data.data;
        setDoctors((prev) =>
          prev.map((doctor) =>
            doctor.id === id
              ? { ...doctor, status: updatedDoctor.status }
              : doctor
          )
        );
        toast.success(response?.data?.message);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unknown error";
      setIsError((prev) => ({ ...prev, edit: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, edit: false }));
    }
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
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
      <DoctorFilters
        statusFilter={statusFilter}
        handleFilter={handleFilter}
        statusOptions={filterOptions}
        specialityFilter={specialityFilter}
      />
      {loading.fetch ? (
        <Preloader />
      ) : (
        <DoctorsPage
          doctors={doctors}
          loading={loading.fetch}
          error={isError.fetch}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          selectedDoctors={selectedDoctors}
          setSelectedDoctors={setSelectedDoctors}
          handleDeleteSingle={handleDeleteSingle}
          handleDeleteSelected={handleDeleteSelected}
          handleEditDoctor={handleEditDoctor}
        />
      )}
      {toggleModal.delete && (
        <DeleteModal
          open={toggleModal.delete}
          onOpenChange={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          error={isError.delete}
          DeleteLoading={loading.delete}
        />
      )}
      <DoctorStatusChangeModal
        open={toggleModal.edit}
        onOpenChange={handleCloseEditModal}
        handleConfirm={confirmEditChange}
        error={isError.edit}
        isLoading={loading.edit}
        selectedDoctor={selectedEditDoctor}
      />
    </div>
  );
};

export default FetchAllDoctors;
