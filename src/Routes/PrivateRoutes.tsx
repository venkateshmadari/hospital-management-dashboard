import Preloader from "@/components/loaders/Preloader";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/layout/MainLayout";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Preloader />;
  if (!user) return <Navigate to="/auth/login" state={{ from: location }} />;

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default PrivateRoutes;
