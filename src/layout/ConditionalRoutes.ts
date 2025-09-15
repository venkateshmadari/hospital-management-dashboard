import { Settings2, ChartBar } from "lucide-react";
import { TbLayoutDashboardFilled, TbTicketOff } from "react-icons/tb";
import { useAuth } from "@/context/AuthContext";
import { HiUsers } from "react-icons/hi2";
import { RiStethoscopeFill } from "react-icons/ri";
import { IoTicket } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";

type SubItem = {
  title: string;
  url: string;
};

type NavItem = {
  title: string;
  heading?: string;
  url: string;
  icon: any;
  items?: SubItem[];
  requiredPermission?: string;
};

const ConditionalRoutes = (): NavItem[] => {
  const { permissions } = useAuth();
  const hasPermission = (perm: string) =>
    permissions?.some((p) => p.name === perm);

  const navItems: NavItem[] = [
    { title: "Dashboard", url: "/", icon: TbLayoutDashboardFilled },
    {
      title: "Profile",
      url: "/profile",
      icon: FaCircleUser,
      requiredPermission: "VIEW_PROFILE",
    },
    {
      title: "Doctors",
      url: "/doctors",
      icon: RiStethoscopeFill,
      requiredPermission: "VIEW_DOCTORS",
    },
    {
      title: "Patients",
      url: "/patients",
      icon: HiUsers,
      requiredPermission: "VIEW_PATIENTS",
    },
    {
      heading: "Appointments",
      title: "Appointments",
      url: "/apppointments",
      icon: IoTicket,
      requiredPermission: "VIEW_APPOINTMENTS",
    },
    {
      heading: "Appointments",
      title: "Total appointments",
      url: "/total-apppointments",
      icon: IoTicket,
      requiredPermission: "VIEW_TOTAL_APPOINTMENTS",
    },
    {
      title: "Rejected appointments",
      url: "/rejected-appointments",
      icon: TbTicketOff,
      requiredPermission: "VIEW_REJECTED_APPOINTMENTS",
    },
  ];
  return navItems.filter(
    (item) => !item.requiredPermission || hasPermission(item.requiredPermission)
  );
};

export default ConditionalRoutes;
