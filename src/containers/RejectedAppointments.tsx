import useFetchData from "@/hooks/useFetchData";
import axiosInstance from "@/instance/instance";
import { PaginationStateTypes } from "@/types/pagination";
import { TotalAppointmentTypes } from "@/types/total-appointment";
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
import DeleteModal from "@/components/modals/DeleteModal";
import toast from "react-hot-toast";
import TotalAppointmentsPage from "@/pages/TotalAppointmentsPage";
import DoctorStatsCardsSkeleton from "@/components/skeletonLoadings/DoctorStatsCardsSkeleton";
import RejectedAppointmentFilter from "@/pages/filters/RejectedAppointmentFilter";
import RejectedAppointmentsPage from "@/pages/RejectedAppointmentsPage";
import ReassignModal from "@/components/modals/ReassignModal";

const RejectedAppointments = () => {
  const [loading, setLoading] = useState({
    fetch: false,
    reassign: false,
    delete: false,
  });
  const [isError, setIsError] = useState({
    fetch: null as string | null,
    reassign: null as string | null,
    delete: null as string | null,
  });
  const [toggleModal, setToggleModal] = useState({
    delete: false,
    reassign: false,
  });
  const [rejectedAppointments, setRejectedAppointments] = useState<
    TotalAppointmentTypes[]
  >([]);
  const [selectedAppointment, setSelectedAppointment] = useState<string[]>([]);
  const [selectRejectAppointment, setSelectRejectAppointment] =
    useState<TotalAppointmentTypes | null>(null);
  const [pagination, setPagination] = useState<PaginationStateTypes>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 0,
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const specialityFilter = searchParams.get("speciality") || "";

  const fetchAppointments = useCallback(async () => {
    setLoading((prev) => ({ ...prev, fetch: true }));
    setIsError((prev) => ({ ...prev, fetch: null }));
    try {
      const queryParams = new URLSearchParams({
        limit: pagination.itemsPerPage.toString(),
        page: pagination.currentPage.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(specialityFilter &&
          specialityFilter !== "all" && { speciality: specialityFilter }),
      });

      const response = await axiosInstance.get(
        `/admin/rejected-appointments?${queryParams}`
      );
      if (response?.status === 200) {
        setRejectedAppointments(response?.data?.data || []);
        setPagination((prev) => ({
          ...prev,
          currentPage: response.data?.pagination?.currentPage || 1,
          totalPages: response.data?.pagination?.totalPages || 1,
          totalItems: response.data?.pagination?.totalItems || 0,
          totalCount: response.data?.pagination?.totalCount || 0,
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

  const handleDeleteSingle = (id: string) => {
    setSelectedAppointment([id]);
    setToggleModal((prev) => ({ ...prev, delete: true }));
  };

  const handleCloseDeleteModal = () => {
    setToggleModal((prev) => ({ ...prev, delete: false }));
    setIsError((prev) => ({ ...prev, delete: null }));
  };

  const handleDeleteSelected = () => {
    if (selectedAppointment.length === 0) {
      toast.error("No appointment selected");
      return;
    }
    setToggleModal((prev) => ({ ...prev, delete: true }));
  };

  const handleConfirmDelete = async () => {
    if (selectedAppointment.length === 0) return;

    setLoading((prev) => ({ ...prev, delete: true }));
    setIsError((prev) => ({ ...prev, delete: null }));

    try {
      const response = await axiosInstance.delete("/admin/total-appointments", {
        data: { appointmentsId: selectedAppointment },
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setToggleModal((prev) => ({ ...prev, delete: false }));
        setRejectedAppointments((prev) =>
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

  const handleReassignAppointment = (data: TotalAppointmentTypes) => {
    setSelectRejectAppointment(data);
    setToggleModal((prev) => ({ ...prev, reassign: true }));
  };

  return (
    <div className="flex flex-col">
      <h1 className="mb-2">
        <span className="text-muted-foreground">
          Total rejected appointments :{" "}
        </span>
        {pagination.totalCount}
      </h1>
      <RejectedAppointmentFilter
        handleFilter={handleFilter}
        specialityFilter={specialityFilter}
        placeholder="Search appointments"
      />
      <RejectedAppointmentsPage
        doctorAppointments={rejectedAppointments}
        loading={loading.fetch}
        error={isError.fetch}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        selectedAppointments={selectedAppointment}
        setSelectedAppointments={setSelectedAppointment}
        handleDeleteSingle={handleDeleteSingle}
        handleDeleteSelected={handleDeleteSelected}
        handleReassign={handleReassignAppointment}
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
      <ReassignModal
        open={toggleModal.reassign}
        onOpenChange={(value: boolean) => {
          setToggleModal((prev) => ({ ...prev, reassign: value }));
        }}
        selectedAppointment={selectRejectAppointment}
      />
    </div>
  );
};

export default RejectedAppointments;
