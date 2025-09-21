import CheckAvabilityCard from "@/components/Dashboard/CheckAvabilityCard";
import DashboardStats from "@/components/Dashboard/DashboardStats";
import GreetingCard from "@/components/Dashboard/GreetingCard";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { role, user } = useAuth();
  return (
    <div className="space-y-5">
      <GreetingCard />
      <DashboardStats />
      {role === "DOCTOR" && user?.Avability?.length === 0 && (
        <CheckAvabilityCard />
      )}
    </div>
  );
};

export default Dashboard;
