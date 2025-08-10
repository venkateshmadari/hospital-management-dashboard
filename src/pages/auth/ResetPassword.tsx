import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "@/instance/instance";
import InlineLoader from "@/components/loaders/InlineLoader";
import ErrorBlock from "@/components/ErrorBlock";
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
import { FaEye, FaEyeSlash } from "react-icons/fa";

type ResetFormInputs = {
  newPassword: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormInputs>();

  const onSubmit = async (data: ResetFormInputs) => {
    if (!email) {
      toast.error("Email is missing from the link.");
      return;
    }
    const { newPassword, confirmPassword } = data;
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsError(null);
    setLoading(true);
    try {
      const res = await axiosInstance.post("/admin/auth/reset-password", {
        email,
        newPassword,
        confirmPassword,
      });

      if (res.status === 200) {
        toast.success(res.data.message);
        navigate("/auth/login");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      setIsError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-gradient-to-tl dark:from-teal-600/30 dark:via-black dark:to-teal-600/30 bg-gradient-to-tl from-teal-500/25 via-white to-teal-500/25 h-full w-full min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 relative z-10 backdrop-blur-sm rounded-3xl">
        <CardHeader className="text-center space-y-3">
          <CardTitle className="text-2xl font-semibold font-unbounded text-teal-600">
            Reset Password
          </CardTitle>
          <CardDescription className="text-muted-foreground -mt-4">
            Set your new password for{" "}
            <span className="font-medium">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password*</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  {...register("newPassword", {
                    required: "Password is required",
                  })}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password*</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  {...register("confirmPassword", {
                    required: "Please confirm password",
                  })}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {isError && <ErrorBlock error={isError} />}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-600 cursor-pointer font-medium py-3 px-4 rounded-md text-white transition-colors duration-200 flex justify-center items-center"
            >
              {loading ? <InlineLoader /> : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
