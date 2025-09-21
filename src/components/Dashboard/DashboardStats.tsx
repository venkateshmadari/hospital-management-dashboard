import ErrorBlock from "@/components/ErrorBlock";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import useFetchData from "@/hooks/useFetchData";
import { HiUsers } from "react-icons/hi2";
import { IoIosGitNetwork } from "react-icons/io";
import { IoTicket } from "react-icons/io5";
import { MdBookmarkAdded, MdOutlinePendingActions } from "react-icons/md";
import { RiStethoscopeFill } from "react-icons/ri";
import { TbTicketOff } from "react-icons/tb";
import { Link } from "react-router-dom";
import DoctorStatsCardsSkeleton from "../skeletonLoadings/DoctorStatsCardsSkeleton";

export default function DashboardStats() {
  const { data, isLoading, isError } = useFetchData("/admin/dashboard");
  const { role, permissions } = useAuth();

  const hadViewDoctorPermission = permissions?.some(
    (perm) => perm.name === "VIEW_DOCTORS"
  );
  const hadViewPatientsPermission = permissions?.some(
    (perm) => perm.name === "VIEW_PATIENTS"
  );
  const hadViewRejectedAppointmentsPermission = permissions?.some(
    (perm) => perm.name === "VIEW_REJECTED_APPOINTMENTS"
  );
  const stats = [
    ...(role === "DOCTOR"
      ? [
          {
            title: "Total availability days",
            value: data?.avabilityDays,
            icon: <IoIosGitNetwork className="w-6 h-6 text-lime-500" />,
            glow: {
              light: "rgba(6, 182, 212, 0.15)",
              dark: "rgba(6, 182, 212, 0.25)",
            },
            link: "/profile",
          },
        ]
      : []),
    {
      title: "Total appointments",
      value:
        role === "ADMIN"
          ? data?.totalAppointments
          : data?.totalDoctorAppointments,
      icon: <IoTicket className="w-6 h-6 text-primary" />,
      glow: {
        light: "rgba(93, 14, 192, 0.15)",
        dark: "rgba(93, 14, 192, 0.25)",
      },
      link: role === "ADMIN" ? "/total-apppointments" : "/appointments",
    },
    ...(role === "DOCTOR"
      ? [
          {
            title: "Pending appointments",
            value: data?.pendingDoctorAppointments,
            icon: (
              <MdOutlinePendingActions className="w-6 h-6 text-amber-500" />
            ),
            glow: {
              light: "rgba(6, 182, 212, 0.15)",
              dark: "rgba(6, 182, 212, 0.25)",
            },
            link: "/appointments",
          },
        ]
      : []),
    ...(role === "DOCTOR"
      ? [
          {
            title: "Completed appointments",
            value: data?.pendingCompletedAppointments,
            icon: <MdBookmarkAdded className="w-6 h-6 text-emerald-500" />,
            glow: {
              light: "rgba(6, 182, 212, 0.15)",
              dark: "rgba(6, 182, 212, 0.25)",
            },
            link: "/appointments",
          },
        ]
      : []),
    ...(hadViewDoctorPermission
      ? [
          {
            title: "Total doctors",
            value: data?.totalDoctors,
            icon: <RiStethoscopeFill className="w-6 h-6 text-teal-500" />,
            glow: {
              light: "rgba(6, 182, 212, 0.15)",
              dark: "rgba(6, 182, 212, 0.25)",
            },
            link: "/doctors",
          },
        ]
      : []),
    ...(hadViewPatientsPermission
      ? [
          {
            title: "Total patients",
            value: data?.totalPatients,
            icon: (
              <HiUsers className="w-6 h-6 text-green-500 dark:text-green-400" />
            ),
            glow: {
              light: "rgba(34, 197, 94, 0.15)",
              dark: "rgba(34, 197, 94, 0.25)",
            },
            link: "/patients",
          },
        ]
      : []),
    ...(hadViewRejectedAppointmentsPermission
      ? [
          {
            title: "Rejected appointments",
            value: data?.rejectedAppointments,
            icon: (
              <TbTicketOff className="w-6 h-6 text-red-500 dark:text-red-400" />
            ),
            glow: {
              light: "rgba(239, 68, 68, 0.15)",
              dark: "rgba(239, 68, 68, 0.25)",
            },
            link: "/rejected-appointments",
          },
        ]
      : []),
  ];

  return (
    <>
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DoctorStatsCardsSkeleton length={4} />
        </div>
      ) : isError ? (
        <ErrorBlock error={isError} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, idx) => (
            <Link key={idx} to={item.link}>
              <Card className="relative overflow-hidden rounded-3xl dark:border dark:border-gray-800 backdrop-blur-md">
                <div
                  className="absolute inset-0 z-0 dark:bg-muted bg-white"
                  style={{
                    background: `radial-gradient(ellipse 80% 60% at 50% 0%, var(--glow-color), transparent 70%), var(--base-color)`,
                    ["--glow-color" as any]: item.glow.dark,
                    ["--base-color" as any]: "black",
                  }}
                />
                <div
                  className="absolute inset-0 z-0 bg-white dark:hidden"
                  style={{
                    background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${item.glow.light}, transparent 70%), #ffffff`,
                  }}
                />

                {/* Card content */}
                <div className="relative z-10">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm text-muted-foreground select-none">
                      {item.title}
                    </CardTitle>
                    {item.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-light select-none">
                      {item.value}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
