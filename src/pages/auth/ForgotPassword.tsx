import ErrorBlock from "@/components/ErrorBlock";
import InlineLoader from "@/components/loaders/InlineLoader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { FaHandsHoldingChild } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "@/instance/instance";

type forgotFormInputs = {
  email: string;
};

const ForgotPassword = () => {
  const [loading, setLoading] = useState<{
    forgot: boolean;
    verifyOtp: boolean;
  }>({
    forgot: false,
    verifyOtp: false,
  });
  const [isError, setIsError] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [oldEmail, setOldEmail] = useState<any>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgotFormInputs>();

  const onSubmit = async (data: forgotFormInputs) => {
    const { email } = data;
    setOldEmail(email);
    setIsError(null);
    setLoading((prev) => ({
      ...prev,
      forgot: true,
    }));
    try {
      const res = await axiosInstance.post("/admin/auth/forgot-password", {
        email,
      });
      if (res.status === 200) {
        toast.success(res?.data?.message);
        setIsOtpModalOpen(true);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      setIsError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading((prev) => ({
        ...prev,
        forgot: false,
      }));
    }
  };

  const handleOtpVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the full 6-digit OTP");
      return;
    }
    setLoading((prev) => ({
      ...prev,
      verifyOtp: true,
    }));
    console.log(oldEmail, otp);
    try {
      const res = await axiosInstance.post("/admin/auth/verify-otp", {
        email: oldEmail,
        otp,
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        setIsOtpModalOpen(false);
        navigate(`/auth/reset-password?email=${oldEmail}`);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      toast.error(errorMessage);
    } finally {
      setLoading((prev) => ({
        ...prev,
        verifyOtp: false,
      }));
    }
  };

  return (
    <div>
      <div className="dark:bg-gradient-to-tl dark:from-teal-600/30 dark:via-black dark:to-teal-600/30 bg-gradient-to-tl from-teal-500/25 via-white to-teal-500/25 h-full w-full min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 relative z-10 backdrop-blur-sm rounded-3xl">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-500 rounded-full flex items-center justify-center">
              <FaHandsHoldingChild className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold font-unbounded text-teal-600">
              Forgot password
            </CardTitle>
            <CardDescription className="text-muted-foreground -mt-4">
              Enter your email and verify OTP to make new password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 text-sm"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email Address*</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {isError && <ErrorBlock error={isError} />}

              <Button
                type="submit"
                disabled={loading.forgot}
                className="w-full bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-600 cursor-pointer font-medium py-3 px-4 rounded-md text-white transition-colors duration-200 flex justify-center items-center"
              >
                {loading.forgot ? <InlineLoader /> : "Send OTP"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="dark:text-white text-black hover:underline font-medium"
              >
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OTP Verification Modal */}
      <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Verify OTP</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <Button
              type="submit"
              disabled={loading.verifyOtp}
              onClick={handleOtpVerify}
              className="w-full bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-600 cursor-pointer font-medium py-3 px-4 rounded-md text-white transition-colors duration-200 flex justify-center items-center"
            >
              {loading.verifyOtp ? <InlineLoader /> : "Verify OTP"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ForgotPassword;
