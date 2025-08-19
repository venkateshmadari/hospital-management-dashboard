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
import SingleDoctorFetch from "@/containers/SingleDoctorFetch";
import FetchProfile from "@/containers/FetchProfile";
import FetchAllPatients from "@/containers/FetchAllPatients";
import SinglePatient from "@/containers/SinglePatient";

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
          <Route path="/profile" element={<FetchProfile />} />
          <Route path="/doctors" element={<FetchAllDoctors />} />
          <Route path="/doctors/:id" element={<SingleDoctorFetch />} />
          <Route path="/patients" element={<FetchAllPatients />} />
          <Route path="/patients/:id" element={<SinglePatient />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AdminRoutes;
