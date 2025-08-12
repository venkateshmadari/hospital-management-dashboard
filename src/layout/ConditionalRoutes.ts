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
};

const ConditionalRoutes = (): NavItem[] => {
  const { role } = useAuth();

  const navItems: NavItem[] = [
    { title: "Dashboard", url: "/", icon: TbLayoutDashboardFilled },
    {
      title: "Profile",
      url: "/profile",
      icon: FaCircleUser,
    },
    {
      title: "Doctors",
      url: "/doctors",
      icon: RiStethoscopeFill,
    },
    {
      title: "Patients",
      url: "/patients",
      icon: HiUsers,
    },
    {
      heading: "Appointments",
      title: "Total appointments",
      url: "/total-apppintments",
      icon: IoTicket,
    },
    {
      title: "Cancelled appointments",
      url: "/cancelled-appointments",
      icon: TbTicketOff,
    },
  ];
  return navItems;
};

export default ConditionalRoutes;
