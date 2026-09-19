"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, CreditCard, Coins, Activity, Loader2, AlertCircle, RefreshCcw, UserCircle, Briefcase } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { AdminOverview } from "@/types/admin";
import { Button } from "@/components/ui/button";

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
    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Platform Overview</h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-lg font-semibold text-red-800 mb-2">{error}</h2>
            <Button onClick={fetchDashboardData} variant="outline" className="mt-4 bg-white hover:bg-slate-100">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderValue = (val: number | null | undefined) => {
    if (isLoading) return <div className="h-8 w-24 bg-slate-200 animate-pulse rounded"></div>;
    if (val === null || val === undefined) return "Coming soon";
    return val.toLocaleString();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Platform Overview</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchDashboardData} 
          disabled={isLoading}
          className="text-slate-500 hover:text-slate-700"
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {renderValue(data?.stats?.total_users)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {renderValue(data?.stats?.total_businesses)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {renderValue(data?.stats?.active_subscriptions)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {renderValue(data?.stats?.credits_used)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 flex flex-col">
          <CardHeader>
            <CardTitle>AI Usage Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-12 w-full bg-slate-100 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold text-blue-600 mb-1">{data?.ai_usage?.total_generations ?? "Coming soon"}</span>
                  <span className="text-sm font-medium text-slate-500">Total Generations</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold text-indigo-600 mb-1">{data?.ai_usage?.posts_generated ?? "Coming soon"}</span>
                  <span className="text-sm font-medium text-slate-500">Posts Generated</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold text-pink-600 mb-1">{data?.ai_usage?.reels_generated ?? "Coming soon"}</span>
                  <span className="text-sm font-medium text-slate-500">Reels Generated</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold text-amber-600 mb-1">{data?.ai_usage?.images_generated ?? "Coming soon"}</span>
                  <span className="text-sm font-medium text-slate-500">Images Generated</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center col-span-2">
                  <span className="text-3xl font-bold text-purple-600 mb-1">{data?.ai_usage?.photoshoots_generated ?? "Coming soon"}</span>
                  <span className="text-sm font-medium text-slate-500">Photoshoots Generated</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto max-h-[400px]">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 animate-pulse rounded w-1/2"></div>
                      <div className="h-3 bg-slate-200 animate-pulse rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.recent_registrations?.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400">
                <p>No recent registrations</p>
              </div>
            ) : (
              <div className="space-y-6">
                {data?.recent_registrations.map(user => (
                  <div key={user.id} className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <UserCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                        <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-medium bg-slate-100 text-slate-600 capitalize">
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 whitespace-nowrap">
                      {formatDate(user.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-200 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 animate-pulse rounded w-32"></div>
                      <div className="h-3 bg-slate-200 animate-pulse rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : data?.recent_businesses?.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-slate-400">
              <p>No recent businesses</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-y border-slate-100">
                  <tr>
                    <th className="px-4 py-3 font-medium">Business</th>
                    <th className="px-4 py-3 font-medium">Owner</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">City</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.recent_businesses.map((business) => (
                    <tr key={business.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-slate-900">{business.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{business.owner_name}</td>
                      <td className="px-4 py-3">
                        {business.category ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                            {business.category}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{business.city || <span className="text-slate-400 italic">N/A</span>}</td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(business.created_at)}</td>
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
