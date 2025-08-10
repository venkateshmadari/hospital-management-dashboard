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
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FaHandsHoldingChild } from "react-icons/fa6";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(null);
    setLoading(true);
    try {
      await login({ email, password });
    } catch (err: any) {
      console.log(err);
      setIsError(err.message || err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="dark:bg-gradient-to-tl dark:from-primary/30 dark:via-black dark:to-primary/30 bg-gradient-to-tl from-primary/25 via-white to-primary/25 h-full w-full min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-sm mx-4 relative z-10 backdrop-blur-sm rounded-3xl">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 custom-gradient rounded-full flex items-center justify-center">
              <FaHandsHoldingChild className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold font-unbounded gradient-text">
              Log in to your account
            </CardTitle>
            <CardDescription className="text-muted-foreground -mt-4">
              Enter your credentials to sign in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-0 focus:shadow-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Password
                  </Label>
                  <Link
                    to={`/auth/forgot-password`}
                    className="text-muted-foreground text-xs text-end"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-0 focus:shadow-none"
                    required
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
              </div>
              {isError && <ErrorBlock error={isError} />}
              <Button
                type="submit"
                disabled={loading}
                className="w-full custom-gradient cursor-pointer font-medium py-3 px-4 rounded-md text-white transition-colors duration-200 flex justify-center items-center"
              >
                {loading ? <InlineLoader /> : "Sign In"}
              </Button>
            </form>
            <div className="text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link
                to="/auth/register"
                className="dark:text-white text-black hover:underline font-medium"
              >
                Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
