"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  Building2, 
  CreditCard, 
  Coins, 
  BrainCircuit, 
  BarChart3, 
  FileText, 
  LifeBuoy, 
  Settings,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Businesses", href: "/admin/businesses", icon: Building2 },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { name: "Credits", href: "/admin/credits", icon: Coins },
  { name: "AI Usage", href: "/admin/ai-usage", icon: BrainCircuit },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Support", href: "/admin/support", icon: LifeBuoy },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-lg text-white">
          <BrainCircuit className="w-6 h-6 text-blue-500" />
          <span>SevenUnique AI<br/><span className="text-xs text-blue-400 uppercase tracking-widest">Admin</span></span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-slate-300 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}
