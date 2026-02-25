"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  FileText,
  GitCompare,
  MessageSquare,
  FileWarning,
  History,
  LogOut,
  Menu,
  X,
  Bookmark,
  BarChart3,
  Bot,
  ChevronDown,
  User,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Analyze", icon: FileText },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/roleplay", label: "Negotiate", icon: MessageSquare },
  { href: "/dispute", label: "Dispute", icon: FileWarning },
  { href: "/chat", label: "Chat", icon: Bot },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/history", label: "History", icon: History },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const initials = user.name
    ?.split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-black/[0.06] supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[56px]">

            {/* Logo */}
            <Link href="/dashboard" className="flex items-center group">
              <Image
                src="/logolex.png"
                alt="LexAI"
                width={90}
                height={90}
                className="rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
              />
            </Link>

            {/* Desktop Nav — pill style */}
            <nav className="hidden lg:flex items-center">
              <div className="flex items-center bg-gray-100/70 rounded-full p-[3px]">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative flex items-center gap-1.5 px-3.5 py-[7px] rounded-full text-[13px] font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-white text-gray-900 shadow-sm shadow-black/[0.06]"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <item.icon className="w-3.5 h-3.5" strokeWidth={isActive ? 2.2 : 1.8} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full hover:bg-gray-100/80 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                    {initials}
                  </div>
                  <span className="text-[13px] font-medium text-gray-700 max-w-[100px] truncate">
                    {user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-[220px] bg-white rounded-xl shadow-lg shadow-black/[0.08] border border-black/[0.06] py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3.5 py-2.5 border-b border-gray-100">
                      <p className="text-[13px] font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="flex items-center gap-2.5 w-full px-3.5 py-2 text-[13px] text-gray-600 hover:text-red-600 hover:bg-red-50/60 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {mobileOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav — full overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-[57px] left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-xl border-b border-black/[0.06] shadow-lg shadow-black/[0.05]">
            <div className="max-w-lg mx-auto px-4 py-4">
              {/* User info */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>

              {/* Nav grid */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl text-center transition-colors ${
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
                      <span className="text-[11px] font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Sign out */}
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-500 hover:bg-red-50/50 transition-colors cursor-pointer border border-gray-100"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
