"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/community", label: "Community" },
  { href: "/requests", label: "Requests" },
  { href: "/chat", label: "Chat" },
  { href: "/video-call", label: "Call" },
  { href: "/map", label: "Map" },
  { href: "/profile", label: "Profile" },
  { href: "/admin", label: "Admin" }
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  return (
    <div className="site-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brand-mark">PC</span>
          <div>
            <strong>PlayCircle</strong>
            <span>Find your game partner</span>
          </div>
        </Link>
        <nav className="nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
                {isActive ? (
                  <motion.span
                    className="nav-pill"
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="auth-actions">
          <ThemeToggle />
          {loading ? (
            <span className="nav-meta">Loading...</span>
          ) : user ? (
            <>
              <span className="nav-meta">
                {user.name} ({user.role})
              </span>
              <button className="button button-secondary" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="button button-secondary">
                Sign in
              </Link>
              <Link href="/register" className="button button-primary">
                Join free
              </Link>
            </>
          )}
        </div>
      </header>
      <main className="page">{children}</main>
    </div>
  );
}
