"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Store, Palette, Package, Settings, LogOut, Sparkles, Megaphone, MessageSquare, Star, Library, Share2, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Business", href: "/business", icon: Store },
  { name: "Brand Kit", href: "/brand", icon: Palette },
  { name: "Products", href: "/products", icon: Package },
  { 
    name: "Social Media", 
    icon: Share2, 
    children: [
      { name: "Create Ad", href: "/create-ad" },
      { name: "Create Reel", href: "/create/reel" },
      { name: "AI Post Maker", href: "/ai-post" },
      { name: "AI Photoshoot", href: "/ai-photoshoot" },
      { name: "AI Calendar", href: "/ai-calendar" },
    ]
  },
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
  
  // By default open the Social Media dropdown if we are on one of its pages
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    "Social Media": ["/create-ad", "/create/reel", "/ai-post", "/ai-photoshoot", "/ai-calendar"].some(p => pathname.startsWith(p))
  });

  const toggleDropdown = (name: string) => {
    setOpenDropdowns(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="hidden lg:flex h-full w-64 flex-col bg-card border-r border-border">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-primary-600">
          SevenUnique AI
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          if (item.children) {
            const isOpen = openDropdowns[item.name];
            const isChildActive = item.children.some(child => pathname.startsWith(child.href));
            
            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className={cn(
                    "group w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isChildActive && !isOpen
                      ? "bg-primary-50 text-primary-700"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center">
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isChildActive && !isOpen ? "text-primary-600" : "text-muted-foreground group-hover:text-foreground"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </div>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="pl-11 pr-3 space-y-1">
                    {item.children.map((child) => {
                      const isActive = pathname.startsWith(child.href);
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                            isActive
                              ? "bg-primary-50 text-primary-700"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = pathname.startsWith(item.href as string);
          return (
            <Link
              key={item.name}
              href={item.href as string}
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


