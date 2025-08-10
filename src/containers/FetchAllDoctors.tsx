import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/instance/instance";
import { DoctorsType } from "@/types/all-doctor";
import Preloader from "@/components/loaders/Preloader";
import DoctorFilters from "@/pages/filters/DoctorFilters";
import DoctorsPage from "@/pages/DoctorsPage";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaginationComponent from "@/components/PaginationComponent";

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const FetchAllDoctors: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<DoctorsType[]>([]);
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

  const getDoctors = useCallback(async () => {
    setLoading(true);
    setIsError(null);
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
        setIsError("Failed to fetch doctors");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unknown error";
      setIsError(errorMessage);
    } finally {
      setLoading(false);
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

  return (
    <div className="flex flex-col">
      <DoctorFilters
        statusFilter={statusFilter}
        handleFilter={handleFilter}
        statusOptions={filterOptions}
        specialityFilter={specialityFilter}
      />
      {loading ? (
        <Preloader />
      ) : (
        <DoctorsPage
          doctors={doctors}
          loading={loading}
          error={isError}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default FetchAllDoctors;
