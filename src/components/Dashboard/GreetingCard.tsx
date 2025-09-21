import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MdArrowOutward } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function GreetingCard() {
  const [greeting, setGreeting] = useState("Hello");
  const { role, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon");
    } else if (hour >= 17 && hour < 20) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Night");
    }
  }, []);

  const handleRedirect = () => {
    if (role === "ADMIN") {
      navigate("/total-apppointments");
    } else {
      navigate("/apppointments");
    }
  };

  return (
    <div className="relative z-10 w-full max-w-7xl max-h-64 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row items-center md:items-stretch bg-white dark:bg-gray-900">
      {/* Theme-aware gradient background */}
      <div
        className="absolute inset-0 z-0 rounded-3xl"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #f0f9ff 80%, #e6f7e6 100%)", // light mode colors
        }}
      />
      <div
        className="absolute inset-0 z-0 rounded-3xl hidden dark:block"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #000000 40%, #072607 100%)", // dark mode colors
        }}
      />

      {/* Content */}
      <div className="flex-1 p-8 md:p-12 flex flex-col justify-center text-center md:text-left relative z-10">
        <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white capitalize">
          {greeting}, {user?.name} 👋
        </h2>
        <p className="mt-4 text-muted-foreground">
          Welcome back! Check your dashboard or appointments today.
        </p>
        <Button
          className="mt-6 self-center md:self-start inline-flex items-center cursor-pointer rounded-full"
          variant={"outline"}
          onClick={handleRedirect}
        >
          Explore appointments <MdArrowOutward />
        </Button>
      </div>

      {/* Image */}
      <div className="flex-1 relative w-full md:w-auto md:block hidden z-10">
        <img
          src="/doctor.png"
          alt="Doctor"
          className="w-full h-64 md:h-full object-cover md:object-contain"
        />
      </div>
    </div>
  );
}
