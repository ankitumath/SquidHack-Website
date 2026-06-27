import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to admin dashboard
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Save token and email
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminEmail", data.email);

      navigate("/admin");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-radial-gradient from-squid-pink/10 via-black to-black pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md glass-card p-8 rounded-sm border border-gray-800 flex flex-col gap-6 shadow-2xl">
        <div className="text-center">
          <Link to="/" className="inline-block select-none mb-4">
            <div className="font-heading font-black text-2xl tracking-[0.15em] leading-none uppercase text-white">
              SQUID H<span className="triangle-a text-[0.85em] -translate-y-[0.05em]"></span>CK
            </div>
            <div className="text-squid-pink text-[9px] font-bold tracking-[0.2em] mt-1.5 uppercase">
              &lt;/ Admin Auth &gt;
            </div>
          </Link>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-2">
            Enter credentials to access VIP controls
          </p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800 text-red-500 text-xs font-bold py-3 px-4 rounded-sm">
            ✕ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ankitumath30@gmail.com"
              className="bg-black border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full bg-black border border-gray-800 focus:border-squid-pink rounded-sm px-4 pr-11 py-2.5 text-sm text-white focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-squid-pink transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  // Eye icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-squid-pink text-white rounded-sm text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-[0_0_15px_rgba(249,0,77,0.3)] hover:shadow-[0_0_25px_rgba(249,0,77,0.5)] cursor-pointer disabled:opacity-50"
          >
            {loading ? "AUTHENTICATING..." : "Access Frontman Controls"}
          </button>
        </form>

        <div className="flex justify-between items-center border-t border-gray-900 pt-4 mt-2">
          <Link
            to="/"
            className="text-[10px] text-gray-500 hover:text-white uppercase tracking-wider font-bold transition-colors"
          >
            ← Back to home
          </Link>
          <Link
            to="/register"
            className="text-[10px] text-squid-pink hover:text-white uppercase tracking-wider font-bold transition-colors"
          >
            Register Team
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
