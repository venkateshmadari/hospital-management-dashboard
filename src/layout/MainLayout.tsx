import type React from "react";
import MainSidebar from "./MainSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return <MainSidebar>{children}</MainSidebar>;
};

export default MainLayout;
