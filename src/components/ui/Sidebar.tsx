"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";

function makeNavItems(nav: {
  home: string; lou: string; rituals: string; market: string; profile: string; sommeliers: string;
}) {
  return [
    {
      label: nav.home,
      href: "/dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: nav.lou,
      href: "/lou",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
    },
    {
      label: nav.rituals,
      href: "/rituals",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 8h1a4 4 0 110 8h-1" />
          <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
          <line x1="6" y1="2" x2="6" y2="4" />
          <line x1="10" y1="2" x2="10" y2="4" />
          <line x1="14" y1="2" x2="14" y2="4" />
        </svg>
      ),
    },
    {
      label: nav.market,
      href: "/marketplace",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
        </svg>
      ),
    },
    {
      label: nav.profile,
      href: "/profile",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];
}

function makeDesktopOnlyItems(nav: { sommeliers: string }) {
  return [
    {
      label: nav.sommeliers,
      href: "/sommeliers",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
  ];
}

/* ── Mobile bottom navigation ─────────────────────────────────────────────── */
function MobileNav() {
  const pathname = usePathname();
  const { t } = useLocale();
  const navItems = makeNavItems(t.nav);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom">
      {/* Floating pill container */}
      <div className="mx-3 mb-3">
        <div
          className="flex items-center justify-around rounded-[24px] px-1 pt-2 pb-2"
          style={{
            background: "rgba(18, 15, 11, 0.92)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(83, 112, 98, 0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(83,112,98,0.06)",
          }}
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard" || pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-[3px] px-4 py-1.5 transition-all duration-300"
                style={{ color: isActive ? "#222f26" : "rgba(83,112,98,0.4)" }}
              >
                <span
                  className="transition-all duration-300"
                  style={{
                    transform: isActive ? "scale(1.1)" : "scale(1)",
                    filter: isActive ? "drop-shadow(0 0 6px rgba(83,112,98,0.5))" : "none",
                  }}
                >
                  {item.icon}
                </span>
                <span
                  className="text-[9px] tracking-[0.06em] uppercase font-medium transition-all duration-300"
                  style={{ opacity: isActive ? 1 : 0.6 }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/* ── Desktop sidebar ──────────────────────────────────────────────────────── */
function DesktopNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useLocale();
  const navItems = makeNavItems(t.nav);
  const desktopOnlyItems = makeDesktopOnlyItems(t.nav);

  const allItems = [
    ...navItems.slice(0, 4),
    ...desktopOnlyItems,
    navItems[4],
  ];

  return (
    <aside
      className={`hidden md:flex fixed left-0 top-0 z-40 h-screen flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      }`}
      style={{
        background: "rgba(201, 217, 201, 0.95)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(83, 112, 98, 0.08)",
      }}
    >
      {/* Brand + collapse */}
      <div className="flex h-14 items-center justify-between px-4">
        {!collapsed && (
          <Link
            href="/dashboard"
            className="font-serif text-[17px] tracking-tight"
            style={{ color: "#222f26" }}
          >
            Théorea
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200"
          style={{ color: "rgba(83,112,98,0.4)" }}
          onMouseEnter={(e) => ((e.target as HTMLElement).closest("button")!.style.color = "#222f26")}
          onMouseLeave={(e) => ((e.target as HTMLElement).closest("button")!.style.color = "rgba(83,112,98,0.4)")}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* Gold divider */}
      <div className="theorea-divider mx-4" />

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-0.5">
          {allItems.slice(0, -1).map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard" || pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-all duration-200 ${
                    collapsed ? "justify-center" : ""
                  }`}
                  style={{
                    color: isActive ? "#222f26" : "rgba(83,112,98,0.5)",
                    background: isActive ? "rgba(83,112,98,0.14)" : "transparent",
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <span
                    className="shrink-0 transition-all duration-200"
                    style={{
                      filter: isActive ? "drop-shadow(0 0 4px rgba(83,112,98,0.4))" : "none",
                    }}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="tracking-wide">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile at bottom */}
      <div className="px-2 py-3" style={{ borderTop: "1px solid rgba(83,112,98,0.14)" }}>
        {(() => {
          const profileItem = allItems[allItems.length - 1];
          const isActive = pathname.startsWith(profileItem.href);
          return (
            <Link
              href={profileItem.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-all duration-200 ${
                collapsed ? "justify-center" : ""
              }`}
              style={{
                color: isActive ? "#222f26" : "rgba(83,112,98,0.5)",
                background: isActive ? "rgba(83,112,98,0.14)" : "transparent",
              }}
              title={collapsed ? profileItem.label : undefined}
            >
              <span className="shrink-0">{profileItem.icon}</span>
              {!collapsed && <span className="tracking-wide">{profileItem.label}</span>}
            </Link>
          );
        })()}
      </div>
    </aside>
  );
}

export default function Navigation() {
  return (
    <>
      <MobileNav />
      <DesktopNav />
    </>
  );
}
