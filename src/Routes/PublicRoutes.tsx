import Preloader from "@/components/loaders/Preloader";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PublicRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Preloader />;
  const from = location.state?.from?.pathname || "/";

  return user ? <Navigate to={from} replace /> : <Outlet />;
};

export default PublicRoutes;
