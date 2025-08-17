import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Preloader from "@/components/loaders/Preloader";
import axiosInstance from "@/instance/instance";
import { AxiosResponse } from "axios";
import { doctorAvailability } from "@/types/single-doctor";

type User = {
  id: number;
  email: string;
  role: string;
  image: any;
  name: any;
  designation?: string;
  speciality?: string;
  description?: string;
  createdAt: string;
  Avability: doctorAvailability[];
};

interface AuthContextType {
  user: User | null;
  setUser: any;
  role: string | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  registerUser: (credentials: {
    name: string;
    designation: string;
    speciality: string;
    description: string;
    email: string;
    password: string;
  }) => Promise<AxiosResponse<any>>;
  logout: () => void;
  getUserData: () => Promise<void>;
  updatedProfileData: (credentials: {
    name: string;
    designation?: string;
    speciality?: string;
    description?: string;
  }) => void;
  updateProfileImage: any;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getUserData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/auth/getUserData");
      if (response?.status === 200) {
        setUser(response?.data?.user);
        setRole(response?.data?.user?.role);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      console.log(errorMessage);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const response = await axiosInstance.post("/admin/auth/login", {
        email,
        password,
      });
      console.log(response);
      if (response.status === 200) {
        const { token, role } = response.data;
        localStorage.setItem("token", token);
        setRole(role);
        await getUserData();
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      throw errorMessage;
    }
  };

  const registerUser = async ({
    name,
    email,
    password,
    designation,
    speciality,
    description,
  }: {
    name: string;
    designation: string;
    speciality: string;
    description: string;
    email: string;
    password: string;
  }) => {
    try {
      const res = await axiosInstance.post("/admin/auth/register", {
        name,
        email,
        password,
        designation,
        speciality,
        description,
      });
      return res;
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      throw errorMessage;
    }
  };

  const updateProfileImage = async (file: File) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);

      const response = await axiosInstance.post(
        `/admin/doctors/${user?.id}/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setUser((prevUser: any) => ({
          ...prevUser,
          image: response.data.data.image,
        }));
        return response;
      }
    } catch (error: any) {
      console.error("Error updating profile image:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      throw errorMessage;
    } finally {
      setLoading(false);
    }
  };

  const updatedProfileData = async ({
    name,
    designation,
    speciality,
    description,
  }: {
    name: string;
    designation?: string;
    speciality?: string;
    description?: string;
  }) => {
    try {
      console.log(user?.id, {
        name,
        designation,
        speciality,
        description,
      });
      const response = await axiosInstance.put(`/admin/doctors/${user?.id}`, {
        name,
        designation,
        speciality,
        description,
      });

      if (response.status === 200) {
        setUser((prevUser: any) => ({
          ...prevUser,
          name,
          designation,
          speciality,
          description,
        }));
        return response;
      }
    } catch (error: any) {
      console.error("Error updating profile image:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      throw errorMessage;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setRole(null);
  }, []);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [getUserData]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      role,
      loading,
      login,
      logout,
      getUserData,
      registerUser,
      updateProfileImage,
      updatedProfileData,
    }),
    [
      user,
      setUser,
      role,
      loading,
      login,
      logout,
      getUserData,
      registerUser,
      updateProfileImage,
      updatedProfileData,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? <Preloader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
