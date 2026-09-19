import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      {/* Abstract blurred background shapes */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-purple/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-pink/15 blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-brand-coral/10 blur-[100px]" />
      </div>

      <header className="px-6 h-20 flex items-center border-b border-white/5 bg-background/60 backdrop-blur-xl fixed top-0 w-full z-50">
        <Logo />
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
            Login as User
          </Link>
          <Link href="/admin/login" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
            Admin Login
          </Link>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-16 px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-brand-pink backdrop-blur-md">
            <Sparkles className="mr-2 h-4 w-4 text-brand-purple" />
            AI Marketing for Indian Small Businesses
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Your Business<br />
            Deserves to{" "}
            <span className="text-brand-gradient">
              Grow
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
            Create stunning social media posts, run ads, and manage your brand effortlessly. SevenUnique AI is your personal AI marketing agency.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button asChild size="lg" className="w-full sm:w-auto text-base h-14 px-8">
              <Link href="/signup">
                Start for free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base h-14 px-8 border-white/20">
              <Link href="/login">View Demo</Link>
            </Button>
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 w-full">
          {/* Feature Card 1 */}
          <div className="bg-surface/50 backdrop-blur-xl border border-white/5 shadow-2xl p-8 rounded-3xl text-left space-y-6 hover:-translate-y-2 hover:border-brand-purple/30 transition-all duration-300 group">
            <div className="h-14 w-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white">AI Content</h3>
              <p className="text-text-muted leading-relaxed">Generate ready-to-post reels and images tailored to your specific business and audience.</p>
            </div>
          </div>
          
          {/* Feature Card 2 */}
          <div className="bg-surface/50 backdrop-blur-xl border border-white/5 shadow-2xl p-8 rounded-3xl text-left space-y-6 hover:-translate-y-2 hover:border-brand-pink/30 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/5 rounded-bl-full -z-10" />
            <div className="h-14 w-14 rounded-2xl bg-brand-pink/10 flex items-center justify-center text-brand-pink group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white">Smart Ads</h3>
              <p className="text-text-muted leading-relaxed">Launch targeted campaigns across platforms without needing any marketing expertise.</p>
            </div>
          </div>
          
          {/* Feature Card 3 */}
          <div className="bg-surface/50 backdrop-blur-xl border border-white/5 shadow-2xl p-8 rounded-3xl text-left space-y-6 hover:-translate-y-2 hover:border-brand-coral/30 transition-all duration-300 group">
            <div className="h-14 w-14 rounded-2xl bg-brand-coral/10 flex items-center justify-center text-brand-coral group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white">Engage</h3>
              <p className="text-text-muted leading-relaxed">Manage messages, reviews, and customer relationships in one unified AI inbox.</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-white/5 py-8 mt-12 text-center text-sm text-text-muted z-10 bg-background/50 backdrop-blur-md">
        © {new Date().getFullYear()} SevenUnique AI. All rights reserved.
      </footer>
    </div>
  );
}
