import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";

interface NavItem {
  href: string;
  label: string;
  icon?: string;
}

interface NavbarProps {
  children?: ReactNode;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/matches", label: "Matches", icon: "matches" },
  { href: "/admin", label: "Admin", icon: "admin" },
];

export function Navbar(_props: NavbarProps) {
  const location = useLocation();

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "home":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        );
      case "matches":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        );
      case "admin":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="bg-slate-950/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-12 h-12 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/50 group-hover:shadow-blue-600/70 group-hover:scale-105 transition-all">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl bg-linear-to-r from-blue-400 via-purple-400 to-emerald-400 text-transparent bg-clip-text">
                SPORTZY
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1">
                Live Sports Updates
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`group px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/50"
                      : "text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-xl"
                  }`}
                >
                  {item.icon && (
                    <span
                      className={`transition-transform ${isActive ? "" : "group-hover:scale-110"}`}
                    >
                      {getIcon(item.icon)}
                    </span>
                  )}
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Live Indicator */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
            <div className="relative">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            </div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Live
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
