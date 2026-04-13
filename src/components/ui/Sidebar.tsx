"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";

/* ── Nav item definitions ─────────────────────────────────────────────────── */
function makeNavItems(nav: {
  home: string; lou: string; rituals: string; market: string; profile: string; sommeliers: string;
}) {
  return [
    {
      label: nav.home,
      href: "/dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: nav.lou,
      href: "/lou",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
    },
    {
      label: nav.rituals,
      href: "/rituals",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
  ];
}

/* ══════════════════════════════════════════════════════════════════════════════
   Mobile bottom navigation — solid sage green bar, glassmorphism, rim light
   ══════════════════════════════════════════════════════════════════════════════ */
function MobileNav() {
  const pathname = usePathname();
  const { t } = useLocale();
  const navItems = makeNavItems(t.nav);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom">
      <div className="mx-3 mb-3">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            borderRadius: 24,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 4,
            paddingRight: 4,
            background: "rgba(83, 112, 98, 0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            /* Rim light — 0.5px white at 15% */
            boxShadow: [
              "inset 0 0.5px 0 rgba(255,255,255,0.18)",
              "inset 0 -0.5px 0 rgba(0,0,0,0.10)",
              "0 8px 32px rgba(34,47,38,0.28)",
              "0 2px 8px rgba(34,47,38,0.14)",
            ].join(", "),
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
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "6px 16px",
                  borderRadius: 16,
                  transition: "all 0.25s ease",
                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.45)",
                  background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                  boxShadow: isActive
                    ? "inset 0 0.5px 0 rgba(255,255,255,0.25)"
                    : "none",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    transition: "transform 0.25s ease, filter 0.25s ease",
                    transform: isActive ? "scale(1.08)" : "scale(1)",
                    filter: isActive
                      ? "drop-shadow(0 0 6px rgba(255,255,255,0.35))"
                      : "none",
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    fontSize: 8,
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    fontFamily: "var(--nf-sans)",
                    opacity: isActive ? 1 : 0.55,
                  }}
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

/* ══════════════════════════════════════════════════════════════════════════════
   Desktop sidebar — sage green with glassmorphism, white text/icons
   ══════════════════════════════════════════════════════════════════════════════ */
function DesktopNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useLocale();
  const navItems = makeNavItems(t.nav);
  const desktopOnlyItems = makeDesktopOnlyItems(t.nav);

  const allItems = [
    ...navItems.slice(0, 4),
    ...desktopOnlyItems,
    navItems[4], // profile always last
  ];

  return (
    <aside
      className={`hidden md:flex fixed left-0 top-0 z-40 h-screen flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      }`}
      style={{
        background: "rgba(83, 112, 98, 0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        /* Rim light on right edge + elevation */
        borderRight: "0.5px solid rgba(255, 255, 255, 0.12)",
        boxShadow: [
          "inset -0.5px 0 0 rgba(255,255,255,0.10)",
          "4px 0 24px rgba(34,47,38,0.18)",
        ].join(", "),
      }}
    >
      {/* Brand + collapse */}
      <div
        style={{
          display: "flex",
          height: 56,
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: "0 16px",
          borderBottom: "0.5px solid rgba(255,255,255,0.10)",
        }}
      >
        {!collapsed && (
          <Link
            href="/dashboard"
            style={{
              fontFamily: "var(--nf-serif)",
              fontSize: 16,
              letterSpacing: "0.08em",
              color: "#ffffff",
              textDecoration: "none",
            }}
          >
            Théorea
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: "flex",
            height: 30,
            width: 30,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            border: "none",
            background: "rgba(255,255,255,0.08)",
            cursor: "pointer",
            color: "rgba(255,255,255,0.60)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.16)";
            (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.60)";
          }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{
              transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* Navigation items */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          {allItems.slice(0, -1).map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard" || pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    justifyContent: collapsed ? "center" : "flex-start",
                    padding: collapsed ? "10px" : "10px 12px",
                    borderRadius: 12,
                    fontSize: 13,
                    fontFamily: "var(--nf-sans)",
                    fontWeight: 400,
                    letterSpacing: "0.025em",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)",
                    background: isActive
                      ? "rgba(255,255,255,0.14)"
                      : "transparent",
                    boxShadow: isActive
                      ? [
                          "inset 0 0.5px 0 rgba(255,255,255,0.22)",
                          "inset 0 -0.5px 0 rgba(0,0,0,0.06)",
                        ].join(", ")
                      : "none",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      filter: isActive
                        ? "drop-shadow(0 0 5px rgba(255,255,255,0.30))"
                        : "none",
                      transition: "filter 0.2s ease",
                    }}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span>{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile at bottom */}
      <div
        style={{
          padding: "8px",
          borderTop: "0.5px solid rgba(255,255,255,0.10)",
        }}
      >
        {(() => {
          const profileItem = allItems[allItems.length - 1];
          const isActive = pathname.startsWith(profileItem.href);
          return (
            <Link
              href={profileItem.href}
              title={collapsed ? profileItem.label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "10px" : "10px 12px",
                borderRadius: 12,
                fontSize: 13,
                fontFamily: "var(--nf-sans)",
                fontWeight: 400,
                letterSpacing: "0.025em",
                textDecoration: "none",
                transition: "all 0.2s ease",
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)",
                background: isActive ? "rgba(255,255,255,0.14)" : "transparent",
                boxShadow: isActive
                  ? "inset 0 0.5px 0 rgba(255,255,255,0.22)"
                  : "none",
              }}
            >
              <span style={{ flexShrink: 0 }}>{profileItem.icon}</span>
              {!collapsed && <span>{profileItem.label}</span>}
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
