"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loader2, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { creditService } from "@/services/credit.service";
import { CreditBalance, CreditTransaction, Subscription } from "@/types/credits";

const PLANS = [
  { name: "FREE", price: "₹0", credits: 5 },
  { name: "STARTER", price: "₹499/month", credits: 50 },
  { name: "GROWTH", price: "₹999/month", credits: 150 },
  { name: "PRO", price: "₹1,999/month", credits: 400 },
  { name: "BUSINESS", price: "₹4,999/month", credits: 1000 },
];

export default function SubscriptionPage() {
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [history, setHistory] = useState<CreditTransaction[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(false);
        const [bal, sub, hist] = await Promise.all([
          creditService.getCredits(),
          creditService.getSubscription(),
          creditService.getCreditHistory()
        ]);
        setBalance(bal);
        setSubscription(sub);
        setHistory(hist);
      } catch (err) {
        console.error("Failed to load subscription data", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-text-muted space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-lg">Unable to load credit information. Please try again.</p>
        <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Subscription & Credits</h1>
        <p className="text-text-muted">Manage your AI usage and choose the right plan for your business.</p>
      </div>

      {/* Overview Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-surface border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white uppercase">{subscription?.plan || balance?.plan || "FREE"}</div>
            <p className="text-xs text-text-muted mt-1">Status: {subscription?.status || "Active"}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-surface border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Credits Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-purple flex items-center gap-2">
              <Zap className="h-5 w-5 fill-brand-purple" />
              {balance?.credits_remaining || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Credits Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{balance?.credits_used || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Total Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{balance?.credits_total || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {PLANS.map((plan) => {
            const isCurrentPlan = (subscription?.plan || balance?.plan || "FREE").toUpperCase() === plan.name;
            return (
              <Card 
                key={plan.name} 
                className={`bg-surface border flex flex-col ${isCurrentPlan ? "border-brand-purple shadow-[0_0_15px_rgba(190,50,255,0.2)]" : "border-border"}`}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription className="text-xl font-bold text-white">{plan.price}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2 text-text-muted">
                    <Zap className="h-4 w-4 text-brand-purple" />
                    <span>{plan.credits} credits</span>
                  </div>
                </CardContent>
                <CardFooter>
                  {isCurrentPlan ? (
                    <Button className="w-full bg-brand-purple/20 text-brand-purple hover:bg-brand-purple/20 cursor-default" variant="outline">
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Current Plan
                    </Button>
                  ) : (
                    <Button className="w-full bg-surface-elevated text-white hover:bg-surface-elevated/80" variant="secondary">
                      Coming Soon
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* History Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Usage History</h2>
        <Card className="bg-surface border-border">
          {history.length === 0 ? (
            <CardContent className="py-8 text-center text-text-muted">
              No credit transactions found.
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-text-muted">
                <thead className="text-xs uppercase bg-surface-elevated/50 text-text-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                    <th className="px-6 py-4 font-medium">Credits</th>
                    <th className="px-6 py-4 font-medium">Balance After</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((tx) => (
                    <tr key={tx.id} className="border-b border-border/50 hover:bg-surface-elevated/20 transition-colors">
                      <td className="px-6 py-4">{format(new Date(tx.created_at), "MMM d, yyyy h:mm a")}</td>
                      <td className="px-6 py-4 font-medium text-white">{tx.action}</td>
                      <td className={`px-6 py-4 font-bold ${tx.credits < 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {tx.credits > 0 ? '+' : ''}{tx.credits}
                      </td>
                      <td className="px-6 py-4">{tx.balance_after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
