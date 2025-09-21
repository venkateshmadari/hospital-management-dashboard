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
// import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { FaHandsHoldingChild } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  designation: string;
  speciality: string;
  description: string;
};

export const specialities = [
  { value: "generalPhysician", label: "General Physician" },
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "gynecology", label: "Gynecology" },
  { value: "oncology", label: "Oncology" },
  { value: "gastroenterology", label: "Gastroenterology" },
  { value: "urology", label: "Urology" },
  { value: "pulmonology", label: "Pulmonology" },
  { value: "nephrology", label: "Nephrology" },
];

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const onSubmit = async (data: RegisterFormInputs) => {
    const { confirmPassword, ...payload } = data;

    setIsError(null);
    setLoading(true);
    try {
      const res = await registerUser(payload);
      if (res.status === 201) {
        navigate("/auth/login");
        toast.success(res?.data?.message);
      }
    } catch (err: any) {
      setIsError(err || err.toString());
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="dark:bg-gradient-to-tl dark:from-teal-600/30 dark:via-black dark:to-teal-600/30 bg-gradient-to-tl from-teal-500/25 via-white to-teal-500/25 h-full w-full min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-lg mx-4 relative z-10 backdrop-blur-sm rounded-3xl">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-500 rounded-full flex items-center justify-center">
              <FaHandsHoldingChild className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold font-unbounded text-teal-600">
              Create your account
            </CardTitle>
            <CardDescription className="text-muted-foreground -mt-4">
              Fill in your details to register
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 text-sm"
            >
              <div className="grid grid-cols-2 gap-3">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name*</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    {...register("name", {
                      required: "Name is required",
                      maxLength: {
                        value: 25,
                        message: "Name cannot exceed 25 characters",
                      },
                    })}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
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
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password*</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 cursor-pointer flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
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
                      placeholder="Re-enter your password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === watch("password") ||
                          "Passwords do not match",
                      })}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 cursor-pointer flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation*</Label>
                  <Input
                    id="designation"
                    placeholder="Enter your designation"
                    {...register("designation", {
                      required: "Designation is required",
                    })}
                  />
                  {errors.designation && (
                    <p className="text-sm text-red-500">
                      {errors.designation.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 w-full">
                  <Label htmlFor="speciality">Speciality*</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("speciality", value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger className="cursor-pointer w-full bg-muted">
                      <SelectValue placeholder="Select your speciality" />
                    </SelectTrigger>
                    <SelectContent className="w-full cursor-pointer ">
                      {specialities.map(({ value, label }) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="w-full cursor-pointer"
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.speciality && (
                    <p className="text-sm text-red-500">
                      {errors.speciality.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  placeholder="Enter a short description"
                  {...register("description")}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-0 focus:shadow-none"
                  rows={3}
                ></textarea>
              </div>

              {isError && <ErrorBlock error={isError} />}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-600 cursor-pointer font-medium py-3 px-4 rounded-md text-white transition-colors duration-200 flex justify-center items-center"
              >
                {loading ? <InlineLoader /> : "Register"}
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
    </div>
  );
};

export default RegisterPage;
