"use client";

import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase";

const NAV = [
  {
    href: "/dashboard",
    label: "Início",
    exact: true,
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 7.5L9 2L16 7.5V16H12V11H6V16H2V7.5Z"
          fill={active ? "white" : "none"}
          stroke={active ? "white" : "currentColor"}
          strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/posts",
    label: "Posts",
    exact: false,
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="14" height="3.5" rx="1.5"
          fill={active ? "white" : "none"}
          stroke={active ? "white" : "currentColor"} strokeWidth="1.5" />
        <rect x="2" y="7.5" width="9" height="3.5" rx="1.5"
          fill={active ? "white" : "none"}
          stroke={active ? "white" : "currentColor"} strokeWidth="1.5" />
        <rect x="2" y="13" width="6" height="3" rx="1.5"
          fill={active ? "white" : "none"}
          stroke={active ? "white" : "currentColor"} strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    href: "/dashboard/conversas",
    label: "Conversas",
    exact: false,
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 3C2 2.4 2.4 2 3 2H15C15.6 2 16 2.4 16 3V11C16 11.6 15.6 12 15 12H6L2 16V3Z"
          fill={active ? "white" : "none"}
          stroke={active ? "white" : "currentColor"}
          strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/materiais",
    label: "Materiais",
    exact: false,
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 2H11L16 7V16C16 16.6 15.6 17 15 17H4C3.4 17 3 16.6 3 16V3C3 2.4 3.4 2 4 2Z"
          fill={active ? "white" : "none"}
          stroke={active ? "white" : "currentColor"}
          strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M11 2V7H16" stroke={active ? "white" : "currentColor"} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M6 10H12M6 13H10" stroke={active ? "white" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/relatorio",
    label: "Relatório",
    exact: false,
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 14L6 9L9 11L13 6L16 8" stroke={active ? "white" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 16H16" stroke={active ? "white" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function isActive(item: { href: string; exact: boolean }) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  return (
    <div className="min-h-screen bg-cream-100 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex w-56 bg-white border-r border-cream-200 flex-col fixed h-full shadow-warm z-10">
        {/* Logo */}
        <div className="px-6 pt-7 pb-6 border-b border-cream-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sage-500 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
                <path d="M14 4C14 4 8 8 8 14C8 18.4 10.8 22 14 22C17.2 22 20 18.4 20 14C20 8 14 4 14 4Z" fill="white" fillOpacity="0.9" />
              </svg>
            </div>
            <div>
              <p className="font-display text-sm text-stone-dark leading-tight">Lumiar</p>
              <p className="text-[10px] text-stone-warm font-body">Painel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-all ${
                  active
                    ? "bg-sage-500 text-white shadow-warm"
                    : "text-stone-mid hover:bg-cream-100 hover:text-stone-dark"
                }`}
              >
                <span>{item.icon(active)}</span>
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-stone-warm hover:text-terra-500 hover:bg-terra-400 hover:bg-opacity-10 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 2H3C2.4 2 2 2.4 2 3V13C2 13.6 2.4 14 3 14H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M11 5L14 8L11 11M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sair
          </button>
        </div>
      </aside>

      {/* Conteudo */}
      <main className="flex-1 md:ml-56 min-h-screen pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom nav — mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200 z-10 flex">
        {NAV.map((item) => {
          const active = isActive(item);
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[10px] font-body font-medium transition-all ${
                active ? "text-sage-500" : "text-stone-warm"
              }`}
            >
              {item.icon(active)}
              {item.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
