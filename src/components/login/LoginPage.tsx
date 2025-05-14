"use client";

import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
      router.refresh(); // Ensure page updates
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};
    if (!username) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      const token = "fake-jwt-token";
      login(token);
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }
      // Redirect handled by useEffect
    } catch (error) {
      console.error("Login failed", error);
      setErrors({ general: "Invalid username or password" });
    } finally {
      setLoading(false);
    }
  };

  // Don't render login page if authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-[100vh] flex flex-col md:flex-row items-center justify-center dark:bg-[#463f59] lg:px-4 sm:p-[-6px] transition-colors duration-300 gap-8 sm:gap-0">
      <div className="hidden lg:flex w-1/2 justify-center p-6">
        <Image
          alt="Dashboard Image"
          src="/image/illustration.png"
          width={300}
          height={300}
        />
      </div>
      <div className="w-full md:w-1/2 items-center justify-center">
        <div className="lg:w-[30rem] justify-center bg-white dark:bg-gray-900/50 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
          <div>
            <h1 className="text-2xl sm:text-sm  font-bold text-center text-gray-800 dark:text-white">
              Welcome to
              <span className="text-blue-800 block justify-center text-3xl sm:text-md uppercase">
                Chart Crafter
              </span>
            </h1>
            <div className="flex justify-center my-4">
              <button
                onClick={() => {
                  // Simulated Google Sign-In
                  alert("Google Sign-In is not implemented yet.");
                }}
                className="flex items-center justify-center w-full p-3 border rounded-lg text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Sign in with Google"
              >
                <Image
                  src="/image/google.png"
                  alt="Google Icon"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Sign in with Google
              </button>
            </div>
          </div>

          <div>
            {/* <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
            Sign In
          </h1> */}

            <div className="flex items-center justify-around px-4">
              <Image
                alt="line"
                src="/image/line.png"
                width={240}
                height={15}
                className="min-w-18 max-w-60"
              />
              <span className="justify-center px-2">or</span>
              <Image
                alt="line"
                src="/image/line.png"
                width={240}
                height={15}
                className="min-w-18 max-w-60"
              />
            </div>

            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 text-sm rounded-lg text-center">
                {errors.general}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              aria-label="Login Form"
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  }`}
                  autoComplete="username"
                  aria-required="true"
                  aria-invalid={!!errors.username}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {errors.username}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    autoComplete="current-password"
                    aria-required="true"
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    Remember Me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  onClick={() => {
                    alert("Google forgot-password is not implemented yet.");
                  }}
                  className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className={`w-full p-3 rounded-lg text-white font-semibold transition-colors duration-200 ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed flex items-center justify-center"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={loading}
                aria-disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
              Dont have an account?
              <Link
                href="/signup"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
