import axiosInstance from "@/instance/instance";
import { useEffect, useState } from "react";

const useFetchDataWithPagination = (url: string | undefined) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 25,
  });
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(null);
    try {
      let query = `&page=${pagination.currentPage}&limit=${pagination.itemsPerPage}`;
      const res = await axiosInstance.get(`${url}?${query}`);
      console.log(res);
      if (res.status === 200) {
        setData(res.data.data);
        setTotalCount(res.data.pagination.totalCount);
        console.log(res, "salary");
        const { currentPage, totalPages, totalCount } =
          res.data.pagination || {};
        if (
          currentPage !== pagination.currentPage ||
          totalPages !== pagination.totalPages ||
          totalCount !== pagination.totalItems
        ) {
          setPagination((prev) => ({
            ...prev,
            currentPage: currentPage || prev.currentPage,
            totalPages: totalPages || prev.totalPages,
            totalItems: totalCount || prev.totalItems,
          }));
        }
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      setIsError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!url) return;
    fetchData();
  }, [pagination.currentPage, pagination.itemsPerPage, JSON.stringify(url)]);

  const handleItemsPerPageChange = (newSize: number) => {
    setPagination((prev) => ({
      ...prev,
      itemsPerPage: newSize,
      currentPage: 1,
    }));
  };

  return {
    isLoading,
    isError,
    data,
    pagination,
    setPagination,
    setData,
    fetchData,
    totalCount,
    handleItemsPerPageChange,
  };
};

export default useFetchDataWithPagination;
