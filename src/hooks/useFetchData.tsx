import axiosInstance from "@/instance/instance";
import { useEffect, useState } from "react";

const useFetchData = (url: string | undefined) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [data, setData] = useState<any>();

  const fetchData = async () => {
    if (!url) return;
    setIsLoading(true);
    setIsError(null);
    try {
      const res = await axiosInstance.get(`${url}`);
      if (res.status === 200) {
        setData(res.data.data);
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
  }, [JSON.stringify(url)]);

  return {
    isLoading,
    isError,
    data,
    setData,
    fetchData,
  };
};

export default useFetchData;
