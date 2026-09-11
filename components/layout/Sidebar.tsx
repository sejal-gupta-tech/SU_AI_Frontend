"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, Palette, Package, Settings, LogOut, Sparkles, Megaphone, MessageSquare, Star, Library } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Business", href: "/business", icon: Store },
  { name: "Brand Kit", href: "/brand", icon: Palette },
  { name: "Products", href: "/products", icon: Package },
  { name: "AI Content", href: "/content", icon: Sparkles },
  { name: "Content Library", href: "/content-library", icon: Library },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="hidden lg:flex h-full w-64 flex-col bg-card border-r border-border">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-primary-600">
          SevenUnique AI
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-primary-600" : "text-muted-foreground group-hover:text-foreground"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <button
          onClick={logout}
          className="group flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-red-500" />
          Logout
        </button>
      </div>
    </div>
  );
}
