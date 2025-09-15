import { useAuth } from "@/context/AuthContext";
import PreLoader from "@/components/loaders/Preloader";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PermissionProtect = ({
  allowedPermission,
  children,
}: {
  allowedPermission: string;
  children: React.ReactNode;
}) => {
  const { user, permissions, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PreLoader />;

  const isAllowed = permissions.some((prem) => prem.name === allowedPermission);

  if (!user || !isAllowed) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PermissionProtect;
