import useFetchData from "@/hooks/useFetchData";
import axiosInstance from "@/instance/instance";
import { PaginationStateTypes } from "@/types/pagination";
import { useCallback, useEffect, useState } from "react";
import { IoMdBookmarks } from "react-icons/io";
import {
  MdBookmarkAdd,
  MdBookmarkAdded,
  MdOutlinePendingActions,
} from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import DoctorStatsCards from "@/stats/DoctorStatsCards";
import DoctorFilters from "@/pages/filters/DoctorFilters";
import DoctorAppointmentPage from "@/pages/DoctorAppointmentPage";
import DeleteModal from "@/components/modals/DeleteModal";
import toast from "react-hot-toast";
import { AppointmentTypes } from "@/types/appointments";
import AppointmentStatusChangeModal from "@/components/modals/AppointmentStatusChangeModal";
import DoctorStatsCardsSkeleton from "@/components/skeletonLoadings/DoctorStatsCardsSkeleton";

const DoctorAppointments = () => {
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
  const [toggleModal, setToggleModal] = useState({
    delete: false,
    edit: false,
  });
  const [appointments, setAppointments] = useState<AppointmentTypes[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<string[]>([]);
  const [selectedEditAppointment, setSelectedEditAppointment] =
    useState<AppointmentTypes | null>(null);
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
    { id: 2, name: "Accepted", value: "ACCEPTED" },
    { id: 3, name: "Rejected", value: "REJECTED" },
    { id: 3, name: "Pending", value: "PENDING" },
    { id: 3, name: "Completed", value: "COMPLETED" },
  ];

  const handleDeleteSingle = (id: string) => {
    setSelectedAppointment([id]);
    setToggleModal((prev) => ({ ...prev, delete: true }));
  };

  const handleCloseDeleteModal = () => {
    setToggleModal((prev) => ({ ...prev, delete: false }));
    setIsError((prev) => ({ ...prev, delete: null }));
  };
  const handleCloseEditModal = () => {
    setToggleModal((prev) => ({ ...prev, edit: false }));
    setIsError((prev) => ({ ...prev, edit: null }));
  };

  const handleDeleteSelected = () => {
    if (selectedAppointment.length === 0) {
      toast.error("No appointment selected");
      return;
    }
    setToggleModal((prev) => ({ ...prev, delete: true }));
  };

  const handleEditAppointment = (data: AppointmentTypes) => {
    setToggleModal((prev) => ({
      ...prev,
      edit: true,
    }));
    setSelectedEditAppointment(data);
  };

  const handleConfirmDelete = async () => {
    if (selectedAppointment.length === 0) return;

    setLoading((prev) => ({ ...prev, delete: true }));
    setIsError((prev) => ({ ...prev, delete: null }));

    try {
      const response = await axiosInstance.delete("/admin/appointment", {
        data: { appointmentsId: selectedAppointment },
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setToggleModal((prev) => ({ ...prev, delete: false }));
        setAppointments((prev) =>
          prev.filter(
            (appointment) => !selectedAppointment.includes(appointment.id)
          )
        );
        setPagination((prev) => ({
          ...prev,
          totalItems: prev.totalItems - selectedAppointment.length,
          totalPages: Math.ceil(
            (prev.totalItems - selectedAppointment.length) / prev.itemsPerPage
          ),
        }));
        setSelectedAppointment([]);
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

  const confirmEditChange = async (id: string, status: string) => {
    console.log(id, status);
    setLoading((prev) => ({ ...prev, edit: true }));
    setIsError((prev) => ({ ...prev, edit: null }));
    try {
      const response = await axiosInstance.put(
        `/admin/appointments/status/${id}`,
        {
          status,
        }
      );
      if (response.status === 200) {
        setToggleModal((prev) => ({
          ...prev,
          edit: false,
        }));
        const updatedAppoinment = response.data.data;
        console.log(updatedAppoinment);
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === id
              ? { ...appointment, status: updatedAppoinment.status }
              : appointment
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
      text: "Accepted Appointments",
      color: "bg-teal-500",
    },
    {
      icon: <MdBookmarkAdd />,
      count: appointmentStats?.rejectedAppointments,
      text: "Rejected Appointments",
      color: "bg-red-500",
    },
    {
      icon: <MdBookmarkAdded />,
      count: appointmentStats?.completedAppointments,
      text: "Completed Appointments",
      color: "bg-green-500",
    },
  ];
  console.log(appointmentStats);
  console.log(appointments);
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
        {loading.fetch ? (
          <DoctorStatsCardsSkeleton length={5} />
        ) : (
          stats.map((stat, index) => (
            <DoctorStatsCards
              key={index}
              icon={stat.icon}
              count={stat.count}
              text={stat.text}
              color={stat.color}
            />
          ))
        )}
      </div>
      <DoctorFilters
        statusFilter={statusFilter}
        handleFilter={handleFilter}
        statusOptions={filterOptions}
        specialityFilter={specialityFilter}
        placeholder="Search appointments"
      />
      <DoctorAppointmentPage
        doctorAppointments={appointments}
        loading={loading.fetch}
        error={isError.fetch}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        selectedAppointments={selectedAppointment}
        setSelectedAppointments={setSelectedAppointment}
        handleDeleteSingle={handleDeleteSingle}
        handleDeleteSelected={handleDeleteSelected}
        handleEditAppointment={handleEditAppointment}
      />
      {toggleModal.delete && (
        <DeleteModal
          open={toggleModal.delete}
          onOpenChange={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          error={isError.delete}
          DeleteLoading={loading.delete}
        />
      )}
      <AppointmentStatusChangeModal
        open={toggleModal.edit}
        onOpenChange={handleCloseEditModal}
        handleConfirm={confirmEditChange}
        error={isError.edit}
        isLoading={loading.edit}
        selectedAppointment={selectedEditAppointment}
      />
    </div>
  );
};

export default DoctorAppointments;
