import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";

const CheckAvailabilityCard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-center">
      <Card className="relative w-full max-w-8xl flex flex-row overflow-hidden rounded-3xl shadow-lg py-0">
        {/* Background for light mode */}
        <div
          className="absolute inset-0 z-0 block dark:hidden"
          style={{
            background: "#ffffff",
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.15) 1px, transparent 0),
              radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.12) 1px, transparent 0),
              radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.1) 1px, transparent 0)
            `,
            backgroundSize: "20px 20px, 30px 30px, 25px 25px",
            backgroundPosition: "0 0, 10px 10px, 15px 5px",
          }}
        />

        {/* Background for dark mode */}
        <div
          className="absolute inset-0 z-0 hidden dark:block"
          style={{
            background: "#000000",
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
              radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
              radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)
            `,
            backgroundSize: "20px 20px, 30px 30px, 25px 25px",
            backgroundPosition: "0 0, 10px 10px, 15px 5px",
          }}
        />

        <CardContent className="flex-1 p-6 md:p-8 py-0 relative z-10">
          <div className="flex items-center justify-center flex-col">
            <h2 className="text-xl md:text-2xl font-light text-gray-900 dark:text-white text-center mb-2">
              No Availability Set
            </h2>
            <p className="text-muted-foreground max-w-md text-center mb-4">
              You haven’t set your availability yet. To start receiving
              appointments, please update your schedule in your profile.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/profile")}
              className="cursor-pointer inline-flex items-center"
            >
              Set Availability now <MdArrowOutward />
            </Button>
          </div>
        </CardContent>

        {/* Decorative shapes */}
        <div className="absolute -top-10 -right-10 w-40 h-32 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-32 rounded-full bg-pink-500 opacity-20 blur-3xl"></div>
      </Card>
    </div>
  );
};

export default CheckAvailabilityCard;
