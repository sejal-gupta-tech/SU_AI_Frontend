"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, CreditCard, Coins, Activity, Loader2, AlertCircle, RefreshCcw, UserCircle, Briefcase } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { AdminOverview } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
  
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
};

export default function AdminOverviewPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const overview = await adminService.getAdminOverview();
      setData(overview);
    } catch (err: any) {
      console.error("Failed to load admin dashboard:", err);
      setError("Unable to load admin dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [authLoading, user]);

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
        <Card className="border-red-500/20 bg-red-500/10">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-lg font-semibold text-red-400 mb-2">{error}</h2>
            <Button onClick={fetchDashboardData} variant="outline" className="mt-4">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderValue = (val: number | null | undefined) => {
    if (isLoading) return <div className="h-8 w-24 bg-surface-elevated animate-pulse rounded"></div>;
    if (val === null || val === undefined) return "Coming soon";
    return val.toLocaleString();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchDashboardData} 
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-surface border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
            <Users className="h-4 w-4 text-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {renderValue(data?.stats?.total_users)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-surface border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {renderValue(data?.stats?.total_businesses)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-surface border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {renderValue(data?.stats?.active_subscriptions)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-surface border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Credits Used</CardTitle>
            <Coins className="h-4 w-4 text-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {renderValue(data?.stats?.credits_used)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 flex flex-col bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-white">AI Usage Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-12 w-full bg-surface-elevated animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-elevated p-4 rounded-xl border border-border flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold text-brand-purple mb-1">{data?.ai_usage?.total_generations ?? "Coming soon"}</span>
                  <span className="text-sm font-medium text-text-secondary">Total Generations</span>
                </div>
                <div className="bg-surface-elevated p-4 rounded-xl border border-border flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold text-brand-pink mb-1">{data?.ai_usage?.posts_generated ?? "Coming soon"}</span>
                  <span className="text-sm font-medium text-text-secondary">Posts Generated</span>
                </div>
                <div className="bg-surface-elevated p-4 rounded-xl border border-border flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold text-brand-coral mb-1">{data?.ai_usage?.reels_generated ?? "Coming soon"}</span>
                  <span className="text-sm font-medium text-text-secondary">Reels Generated</span>
                </div>
                <div className="bg-surface-elevated p-4 rounded-xl border border-border flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold text-brand-purple mb-1">{data?.ai_usage?.images_generated ?? "Coming soon"}</span>
                  <span className="text-sm font-medium text-text-secondary">Images Generated</span>
                </div>
                <div className="bg-surface-elevated p-4 rounded-xl border border-border flex flex-col items-center justify-center text-center col-span-2">
                  <span className="text-3xl font-bold text-brand-pink mb-1">{data?.ai_usage?.photoshoots_generated ?? "Coming soon"}</span>
                  <span className="text-sm font-medium text-text-secondary">Photoshoots Generated</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3 flex flex-col bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-white">Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto max-h-[400px] custom-scrollbar">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-elevated animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-surface-elevated animate-pulse rounded w-1/2"></div>
                      <div className="h-3 bg-surface-elevated animate-pulse rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.recent_registrations?.length === 0 ? (
              <div className="flex items-center justify-center h-full text-text-muted">
                <p>No recent registrations</p>
              </div>
            ) : (
              <div className="space-y-6">
                {data?.recent_registrations.map(user => (
                  <div key={user.id} className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center flex-shrink-0">
                        <UserCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-text-muted">{user.email}</p>
                        <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-medium bg-surface-elevated text-text-secondary capitalize">
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-text-muted whitespace-nowrap">
                      {formatDate(user.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="text-white">Recent Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-elevated animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-surface-elevated animate-pulse rounded w-32"></div>
                      <div className="h-3 bg-surface-elevated animate-pulse rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : data?.recent_businesses?.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-text-muted">
              <p>No recent businesses</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-muted uppercase bg-surface-elevated border-y border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Business</th>
                    <th className="px-4 py-3 font-medium">Owner</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">City</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data?.recent_businesses.map((business) => (
                    <tr key={business.id} className="hover:bg-surface-elevated transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-brand-pink/10 text-brand-pink flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-white">{business.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{business.owner_name}</td>
                      <td className="px-4 py-3">
                        {business.category ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-elevated border border-border text-text-secondary">
                            {business.category}
                          </span>
                        ) : (
                          <span className="text-text-muted italic">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{business.city || <span className="text-text-muted italic">N/A</span>}</td>
                      <td className="px-4 py-3 text-text-muted whitespace-nowrap">{formatDate(business.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
