import useFetchData from "@/hooks/useFetchData";
import axiosInstance from "@/instance/instance";
import { PaginationStateTypes } from "@/types/pagination";
import { TotalAppointmentTypes } from "@/types/total-appointment";
import React, { useCallback, useEffect, useState } from "react";
import { IoMdBookmarks } from "react-icons/io";
import {
  MdBookmarkAdd,
  MdBookmarkAdded,
  MdOutlinePendingActions,
} from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GoBookmarkSlashFill } from "react-icons/go";
import DoctorStatsCards from "@/stats/DoctorStatsCards";
import DoctorFilters from "@/pages/filters/DoctorFilters";

const TotalAppointments = () => {
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
  const [appointments, setAppointments] = useState<TotalAppointmentTypes[]>([]);
  const [pagination, setPagination] = useState<PaginationStateTypes>({
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

  const { data: appointmentStats } = useFetchData("/admin/appointments/stats");

  const fetchAppointments = useCallback(async () => {
    setLoading((prev) => ({ ...prev, fetch: true }));
    setIsError((prev) => ({ ...prev, fetch: null }));
    try {
      const queryParams = new URLSearchParams({
        limit: pagination.itemsPerPage.toString(),
        page: pagination.currentPage.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter && statusFilter !== "all" && { status: statusFilter }),
        ...(specialityFilter &&
          specialityFilter !== "all" && { status: specialityFilter }),
      });

      const response = await axiosInstance.get(
        `/admin/appointments?${queryParams}`
      );
      if (response?.status === 200) {
        setAppointments(response?.data?.data || []);
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
          fetch: "Failed to fetch appointments",
        }));
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
    fetchAppointments();
  }, [fetchAppointments]);

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
      icon: <IoMdBookmarks />,
      count: appointmentStats?.totalAppointments,
      text: "Total Appointments",
      color: "bg-violet-500",
    },
    {
      icon: <MdOutlinePendingActions />,
      count: appointmentStats?.pendingAppointments,
      text: "Pending Appointments",
      color: "bg-yellow-500",
    },
    {
      icon: <MdBookmarkAdd />,
      count: appointmentStats?.acceptedAppointments,
      text: "Accepted doctors",
      color: "bg-teal-500",
    },
    {
      icon: <GoBookmarkSlashFill />,
      count: appointmentStats?.rejectedAppointments,
      text: "Rejected doctors",
      color: "bg-red-500",
    },
    {
      icon: <MdBookmarkAdded />,
      count: appointmentStats?.completedAppointments,
      text: "Completed doctors",
      color: "bg-green-500",
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
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
    </div>
  );
};

export default TotalAppointments;
