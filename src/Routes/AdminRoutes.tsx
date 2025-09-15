import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import NotFound from "@/components/NotFound";
import Dashboard from "@/pages/Dashboard";
import LoginPage from "@/pages/auth/LoginPage";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import RegisterPage from "@/pages/auth/RegisterPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FetchAllDoctors from "@/containers/FetchAllDoctors";
import SingleDoctorFetch from "@/containers/SingleDoctorFetch";
import FetchProfile from "@/containers/FetchProfile";
import FetchAllPatients from "@/containers/FetchAllPatients";
import SinglePatient from "@/containers/SinglePatient";
import DoctorAppointments from "@/containers/DoctorAppointments";
import TotalAppointments from "@/containers/TotalAppointments";
import RejectedAppointments from "@/containers/RejectedAppointments";
import PermissionProtect from "./PermissionProtect";

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
          <Route
            path="/profile"
            element={
              <PermissionProtect allowedPermission="VIEW_PROFILE">
                <FetchProfile />
              </PermissionProtect>
            }
          />
          <Route
            path="/doctors"
            element={
              <PermissionProtect allowedPermission="VIEW_DOCTORS">
                <FetchAllDoctors />
              </PermissionProtect>
            }
          />
          <Route
            path="/doctors/:id"
            element={
              <PermissionProtect allowedPermission="VIEW_DOCTORS">
                <SingleDoctorFetch />
              </PermissionProtect>
            }
          />
          <Route
            path="/patients"
            element={
              <PermissionProtect allowedPermission="VIEW_PATIENTS">
                <FetchAllPatients />
              </PermissionProtect>
            }
          />
          <Route
            path="/patients/:id"
            element={
              <PermissionProtect allowedPermission="VIEW_PATIENTS">
                <SinglePatient />
              </PermissionProtect>
            }
          />
          <Route
            path="/apppointments"
            element={
              <PermissionProtect allowedPermission="VIEW_APPOINTMENTS">
                <DoctorAppointments />
              </PermissionProtect>
            }
          />
          <Route
            path="/total-apppointments"
            element={
              <PermissionProtect allowedPermission="VIEW_TOTAL_APPOINTMENTS">
                <TotalAppointments />
              </PermissionProtect>
            }
          />
          <Route
            path="/rejected-appointments"
            element={
              <PermissionProtect allowedPermission="VIEW_REJECTED_APPOINTMENTS">
                <RejectedAppointments />
              </PermissionProtect>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AdminRoutes;
