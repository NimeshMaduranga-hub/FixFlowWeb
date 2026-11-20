
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../service/auth";

export const Header: React.FC = () => {

  const { user, setUser } = useAuth();

  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Logout User
  const handleLogout = async () => {

    const refreshToken = localStorage.getItem("REFRESH_TOKEN");

    try {

      if (refreshToken) {
        await logout(refreshToken);
      }

    } catch (error) {

      console.error("Logout Error:", error);

    } finally {

      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("REFRESH_TOKEN");

      setUser(null);

      setIsMenuOpen(false);

      navigate("/login", { replace: true });

    }
  };

  // Active Navigation Link Style
  const activeLinkStyle = ({ isActive }: { isActive: boolean }) =>

      `text-sm font-medium transition ${
          isActive
              ? "text-blue-600"
              : "text-slate-600 hover:text-slate-900"
      }`;

  // Mobile Navigation Link Style
  const mobileLinkStyle = ({ isActive }: { isActive: boolean }) =>

      `block text-sm font-medium transition ${
          isActive
              ? "text-blue-600"
              : "text-slate-700 hover:text-blue-600"
      }`;

  return (

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-8">

                    <span
                        onClick={() => navigate("/")}
                        className="text-2xl font-black tracking-tight text-blue-600 cursor-pointer"
                    >
                        Fix<span className="text-slate-900">Flow</span>
                    </span>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">

              <NavLink to="/" className={activeLinkStyle}>
                Dashboard
              </NavLink>

              <NavLink to="/customers" className={activeLinkStyle}>
                Customers
              </NavLink>

              <NavLink to="/repair-jobs" className={activeLinkStyle}>
                Repair Jobs
              </NavLink>

              {user?.role === "Admin" && (

                  <NavLink to="/admin" className={activeLinkStyle}>
                    Admin Panel
                  </NavLink>

              )}

            </nav>

          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-4">

            {user?.role === "Admin" && (

                <NavLink
                    to="/report"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
                >
                  + Create Repair Job
                </NavLink>

            )}

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">

              <div className="text-right">

                <p className="text-xs font-bold leading-none text-slate-900">
                  {user?.name || "User"}
                </p>

                <p className="text-[10px] text-slate-500 mt-1">
                  {user?.role}
                </p>

              </div>

              <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition"
              >
                Logout
              </button>

            </div>

          </div>

          {/* Mobile Menu Button */}
          <button
              type="button"
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
          >

            <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >

              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                  }
              />

            </svg>

          </button>

        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (

            <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-4 shadow-lg">

              <NavLink
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={mobileLinkStyle}
              >
                Dashboard
              </NavLink>

              <NavLink
                  to="/customers"
                  onClick={() => setIsMenuOpen(false)}
                  className={mobileLinkStyle}
              >
                Customers
              </NavLink>

              <NavLink
                  to="/repair-jobs"
                  onClick={() => setIsMenuOpen(false)}
                  className={mobileLinkStyle}
              >
                Repair Jobs
              </NavLink>

              {user?.role === "Admin" && (

                  <NavLink
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className={mobileLinkStyle}
                  >
                    Admin Panel
                  </NavLink>

              )}

              {user?.role === "Admin" && (

                  <NavLink
                      to="/report"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-sm font-semibold text-blue-600"
                  >
                    + Create Repair Job
                  </NavLink>

              )}

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">

                <div>

                  <p className="text-xs font-bold text-slate-900">
                    {user?.name || "User"}
                  </p>

                  <p className="text-[10px] text-slate-500 mt-1">
                    {user?.role}
                  </p>

                </div>

                <button
                    onClick={handleLogout}
                    className="text-xs font-semibold text-rose-600"
                >
                  Logout
                </button>

              </div>

            </div>

        )}

      </header>
  );
};
