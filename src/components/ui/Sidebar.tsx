"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Lou",
    href: "/lou",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    label: "Rituals",
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
    label: "Market",
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
    label: "Profile",
    href: "/profile",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

const desktopOnlyItems = [
  {
    label: "Sommeliers",
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

/** Mobile bottom tab bar */
function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-steam bg-porcelain/95 backdrop-blur-md md:hidden safe-bottom">
      <ul className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard" || pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] transition-colors duration-gentle ${
                  isActive ? "text-jade" : "text-ink-muted"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Desktop sidebar — collapsible */
function DesktopNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const allItems = [
    ...navItems.slice(0, 4),
    ...desktopOnlyItems,
    navItems[4], // Profile at the end
  ];

  return (
    <aside
      className={`hidden md:flex fixed left-0 top-0 z-40 h-screen flex-col border-r border-steam bg-porcelain transition-all duration-gentle ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Brand + collapse toggle */}
      <div className="flex h-14 items-center justify-between px-4">
        {!collapsed && (
          <Link
            href="/dashboard"
            className="font-serif text-lg tracking-tight text-ink"
          >
            Théorea
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-subtle text-ink-muted hover:bg-parchment hover:text-ink transition-colors duration-gentle"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-gentle ${
              collapsed ? "rotate-180" : ""
            }`}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3">
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
                  className={`flex items-center gap-3 rounded-subtle px-3 py-2.5 text-sm transition-all duration-gentle ${
                    collapsed ? "justify-center" : ""
                  } ${
                    isActive
                      ? "bg-parchment-warm text-jade-dark font-medium"
                      : "text-ink-muted hover:bg-parchment hover:text-ink"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span
                    className={`shrink-0 ${
                      isActive ? "text-jade" : "text-ink-muted"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile at bottom */}
      <div className="border-t border-steam px-2 py-3">
        {(() => {
          const profileItem = allItems[allItems.length - 1];
          const isActive = pathname.startsWith(profileItem.href);

          return (
            <Link
              href={profileItem.href}
              className={`flex items-center gap-3 rounded-subtle px-3 py-2.5 text-sm transition-all duration-gentle ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-parchment-warm text-jade-dark font-medium"
                  : "text-ink-muted hover:bg-parchment hover:text-ink"
              }`}
              title={collapsed ? profileItem.label : undefined}
            >
              <span
                className={`shrink-0 ${
                  isActive ? "text-jade" : "text-ink-muted"
                }`}
              >
                {profileItem.icon}
              </span>
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
