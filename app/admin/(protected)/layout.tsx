import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      <AdminSidebar />
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Admin Dashboard</h2>
        </header>
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-slate-50">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
