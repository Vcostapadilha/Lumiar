"use client";

import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase";

const NAV = [
  {
    href: "/dashboard",
    label: "Posts",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1.5" fill="currentColor" fillOpacity="0.8"/>
        <rect x="10" y="2" width="6" height="6" rx="1.5" fill="currentColor" fillOpacity="0.4"/>
        <rect x="2" y="10" width="6" height="6" rx="1.5" fill="currentColor" fillOpacity="0.4"/>
        <rect x="10" y="10" width="6" height="6" rx="1.5" fill="currentColor" fillOpacity="0.2"/>
      </svg>
    ),
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream-100 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-cream-200 flex flex-col fixed h-full shadow-warm">
        {/* Logo */}
        <div className="px-6 pt-7 pb-6 border-b border-cream-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sage-500 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
                <path d="M14 4C14 4 8 8 8 14C8 18.4 10.8 22 14 22C17.2 22 20 18.4 20 14C20 8 14 4 14 4Z" fill="white" fillOpacity="0.9"/>
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
            const active = pathname === item.href;
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
                <span className={active ? "text-white" : "text-stone-warm"}>
                  {item.icon}
                </span>
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
              <path d="M6 2H3C2.4 2 2 2.4 2 3V13C2 13.6 2.4 14 3 14H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M11 5L14 8L11 11M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sair
          </button>
        </div>
      </aside>

      {/* Conteudo */}
      <main className="flex-1 ml-56 min-h-screen">
        {children}
      </main>
    </div>
  );
}
