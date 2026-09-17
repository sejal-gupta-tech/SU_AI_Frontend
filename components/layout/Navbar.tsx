"use client";

import { useState, useRef, useEffect } from 'react';
import { useAuth } from "@/components/auth/AuthProvider";
import { Menu, Bell, CheckCircle2, Circle } from "lucide-react";

export function Navbar() {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Google Review", message: "Sanjay Verma left a 5-star review.", time: "5m ago", unread: true },
    { id: 2, title: "Campaign Generated", message: "Summer Fashion Sale 2026 is ready.", time: "1h ago", unread: true },
    { id: 3, title: "New Message", message: "Customer asked a question about delivery.", time: "2h ago", unread: false },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const hasUnread = notifications.some(n => n.unread);

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" className="-m-2.5 p-2.5 text-muted-foreground lg:hidden">
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-border lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="relative" ref={dropdownRef}>
            <button 
              type="button" 
              className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
              {hasUnread && (
                <span className="absolute top-2 right-2.5 flex h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-background"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-background py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-border flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                  <button className="text-xs text-primary-600 hover:text-primary-700" onClick={markAllAsRead}>Mark all as read</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`px-4 py-3 hover:bg-muted/50 cursor-pointer flex gap-3 ${notif.unread ? 'bg-primary-50/50' : ''}`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <div className="mt-0.5">
                        {notif.unread ? <Circle className="h-2.5 w-2.5 fill-primary-600 text-primary-600" /> : <CheckCircle2 className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{notif.title}</p>
                        <p className="text-xs text-muted-foreground">{notif.message}</p>
                        <p className="text-[10px] text-muted-foreground">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-border text-center">
                  <button className="text-xs text-muted-foreground hover:text-foreground font-medium" onClick={() => setShowNotifications(false)}>
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

          <div className="flex items-center gap-x-4">
            <span className="hidden lg:flex lg:items-center">
              <span className="text-sm font-medium leading-6 text-foreground" aria-hidden="true">
                {user?.name || "User"}
              </span>
            </span>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
