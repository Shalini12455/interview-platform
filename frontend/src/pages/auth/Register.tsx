import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, isAuthenticated, clearAuthError } =
    useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearAuthError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    if ((result as any).meta?.requestStatus === "fulfilled") {
      toast.success("Account created successfully!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-500">
            Interview Platform
          </h1>
          <p className="text-slate-400 mt-2">
            Start your interview preparation today
          </p>
        </div>

        {/* Card */}
        <div className="bg-dark-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="John"
                  className="w-full px-4 py-3 bg-dark-900 border border-slate-600
                             rounded-lg text-white placeholder-slate-500
                             focus:outline-none focus:border-primary-500
                             focus:ring-1 focus:ring-primary-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
                  className="w-full px-4 py-3 bg-dark-900 border border-slate-600
                             rounded-lg text-white placeholder-slate-500
                             focus:outline-none focus:border-primary-500
                             focus:ring-1 focus:ring-primary-500 transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-dark-900 border border-slate-600
                           rounded-lg text-white placeholder-slate-500
                           focus:outline-none focus:border-primary-500
                           focus:ring-1 focus:ring-primary-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Min 6 characters"
                className="w-full px-4 py-3 bg-dark-900 border border-slate-600
                           rounded-lg text-white placeholder-slate-500
                           focus:outline-none focus:border-primary-500
                           focus:ring-1 focus:ring-primary-500 transition"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-dark-900 border border-slate-600
                           rounded-lg text-white placeholder-slate-500
                           focus:outline-none focus:border-primary-500
                           focus:ring-1 focus:ring-primary-500 transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700
                         text-white font-semibold rounded-lg transition
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-slate-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-500 hover:text-primary-400 font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
