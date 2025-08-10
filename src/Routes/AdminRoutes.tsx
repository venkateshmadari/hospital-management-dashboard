import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import NotFound from "@/components/NotFound";
import Dashboard from "@/pages/Dashboard";
import LoginPage from "@/pages/auth/LoginPage";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import RegisterPage from "@/pages/auth/RegisterPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientsPage from "@/pages/PatientsPage";
import FetchAllDoctors from "@/containers/FetchAllDoctors";

const AdminRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/doctors" element={<FetchAllDoctors />} />
          <Route path="/patients" element={<PatientsPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AdminRoutes;
