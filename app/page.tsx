import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 h-16 flex items-center border-b border-border bg-background/80 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary-600">
          <Sparkles className="w-6 h-6" />
          SevenUnique AI
        </div>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:text-primary-600 transition-colors">
            Login
          </Link>
          <Button asChild className="rounded-full">
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-16 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-primary-50 to-background">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-800">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Marketing for Indian Small Businesses
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Grow your business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-400">AI Marketing</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Create stunning social media posts, run ads, and manage your brand effortlessly. SevenUnique AI is your personal AI marketing agency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="w-full sm:w-auto rounded-full text-base h-12 px-8">
              <Link href="/signup">
                Start for free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full text-base h-12 px-8">
              <Link href="/login">View Demo</Link>
            </Button>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="glass-card p-8 rounded-2xl text-left space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">AI Content Creation</h3>
            <p className="text-muted-foreground">Generate ready-to-post reels and images tailored to your specific business and audience.</p>
          </div>
          <div className="glass-card p-8 rounded-2xl text-left space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Smart Campaigns</h3>
            <p className="text-muted-foreground">Launch targeted ads across platforms without needing marketing expertise.</p>
          </div>
          <div className="glass-card p-8 rounded-2xl text-left space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Customer Engagement</h3>
            <p className="text-muted-foreground">Manage messages, reviews, and customer relationships in one unified inbox.</p>
          </div>
        </div>
      </main>
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SevenUnique AI. All rights reserved.
      </footer>
    </div>
  );
}
