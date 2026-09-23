"use client";

import { useState, useEffect } from "react";
import { autopilotService, QueueItem, AutopilotSchedule } from "@/services/autopilot.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Zap, Clock, CalendarDays, CheckCircle2, XCircle, Loader2,
  Camera, Play, Pause, Trash2, Settings2, Plus, ChevronRight,
  Bot, Flame, RefreshCw
} from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DAY_EMOJIS: Record<string, string> = {
  Monday: "🌅", Tuesday: "⚡", Wednesday: "🎯",
  Thursday: "🔥", Friday: "🎉", Saturday: "📸", Sunday: "🌟"
};

const DEFAULT_SCHEDULE: AutopilotSchedule = {
  Monday: ["11:00"],
  Wednesday: ["19:00"],
  Friday: ["18:00"],
  Sunday: ["12:00"],
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    published: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    failed: "bg-red-500/15 text-red-400 border border-red-500/30",
  };
  const icons: Record<string, React.ReactNode> = {
    pending: <Clock className="w-3 h-3" />,
    published: <CheckCircle2 className="w-3 h-3" />,
    failed: <XCircle className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${styles[status] ?? styles.pending}`}>
      {icons[status]} {status}
    </span>
  );
}

export default function AutopilotPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [schedule, setSchedule] = useState<AutopilotSchedule>(DEFAULT_SCHEDULE);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [scheduleSaved, setScheduleSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"queue" | "schedule">("queue");
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showNotif = (msg: string, type: "success" | "error" = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchQueue = async () => {
    try {
      const data = await autopilotService.getQueue();
      setQueue(data.data ?? []);
    } catch {
      setQueue([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQueue(); }, []);

  const handleToggle = async () => {
    setToggling(true);
    const newVal = !enabled;
    try {
      await autopilotService.toggleAutopilot(newVal);
      setEnabled(newVal);
      showNotif(`Autopilot is now ${newVal ? "ON 🚀" : "OFF"}`);
    } catch {
      showNotif("Failed to toggle Autopilot", "error");
    } finally {
      setToggling(false);
    }
  };

  const toggleDayInSchedule = (day: string) => {
    setSchedule(prev => {
      if (prev[day]) {
        const next = { ...prev };
        delete next[day];
        return next;
      }
      return { ...prev, [day]: ["11:00"] };
    });
  };

  const updateDayTime = (day: string, time: string) => {
    setSchedule(prev => ({ ...prev, [day]: [time] }));
  };

  const saveSchedule = async () => {
    setSavingSchedule(true);
    try {
      await autopilotService.updateSchedule(schedule);
      setScheduleSaved(true);
      showNotif("Schedule saved! ✅");
      setTimeout(() => setScheduleSaved(false), 2000);
    } catch {
      showNotif("Failed to save schedule", "error");
    } finally {
      setSavingSchedule(false);
    }
  };

  const cancelPost = async (id: string) => {
    try {
      await autopilotService.cancelScheduledPost(id);
      setQueue(q => q.filter(i => i.id !== id));
      showNotif("Post removed from queue");
    } catch {
      showNotif("Could not cancel post", "error");
    }
  };

  const pendingCount = queue.filter(q => q.status === "pending").length;
  const publishedCount = queue.filter(q => q.status === "published").length;

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-8">

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-xl transition-all duration-300 ${
          notification.type === "success"
            ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 backdrop-blur-md"
            : "bg-red-500/20 border border-red-500/50 text-red-300 backdrop-blur-md"
        }`}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#BE32FF] to-[#F0449B] flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Instagram Autopilot</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#BE32FF]/20 to-[#F0449B]/20 border border-[#BE32FF]/40 text-[#BE32FF]">
              PREMIUM
            </span>
          </div>
          <p className="text-white/50 text-sm">AI plans → creates → schedules → publishes automatically.</p>
        </div>

        {/* Big ON/OFF Toggle */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`group relative flex items-center gap-4 px-6 py-4 rounded-2xl border-2 transition-all duration-300 font-semibold text-sm min-w-[200px] ${
            enabled
              ? "bg-gradient-to-r from-[#BE32FF]/20 to-[#F0449B]/20 border-[#BE32FF]/60 text-white shadow-lg shadow-purple-500/20"
              : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
          }`}
        >
          <div className={`w-12 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${enabled ? "bg-gradient-to-r from-[#BE32FF] to-[#F0449B]" : "bg-white/15"}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${enabled ? "left-6.5" : "left-0.5"}`} />
          </div>
          <span>
            {toggling ? "Updating..." : enabled ? "🚀 Autopilot ON" : "⏸ Autopilot OFF"}
          </span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "In Queue", value: pendingCount, color: "text-amber-400", icon: <Clock className="w-4 h-4" /> },
          { label: "Published", value: publishedCount, color: "text-emerald-400", icon: <CheckCircle2 className="w-4 h-4" /> },
          { label: "Active Days", value: Object.keys(schedule).length, color: "text-[#BE32FF]", icon: <CalendarDays className="w-4 h-4" /> },
          { label: "Mode", value: enabled ? "Auto" : "Manual", color: "text-white", icon: <Zap className="w-4 h-4" /> },
        ].map(s => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className={`flex items-center justify-center gap-1.5 text-xs text-white/50 mb-1 ${s.color}`}>{s.icon} {s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-white/10">
        {(["queue", "schedule"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-semibold capitalize transition-all ${
              activeTab === tab
                ? "text-white border-b-2 border-[#BE32FF]"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {tab === "queue" ? "📋 Post Queue" : "⏰ Weekly Schedule"}
          </button>
        ))}
      </div>

      {/* Queue Tab */}
      {activeTab === "queue" && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Upcoming Posts</h2>
            <button onClick={fetchQueue} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#BE32FF] animate-spin" />
            </div>
          ) : queue.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                <CalendarDays className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">No posts in queue</h3>
              <p className="text-white/40 text-sm mb-6 max-w-xs mx-auto">
                Turn on Autopilot and configure your weekly schedule. The AI will automatically generate and queue posts.
              </p>
              <button
                onClick={() => setActiveTab("schedule")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#BE32FF] to-[#F0449B] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                <Settings2 className="w-4 h-4" /> Set Schedule
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {queue.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-white/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E1306C] to-[#833AB4] flex items-center justify-center flex-shrink-0">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {new Date(item.scheduled_for).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
                      </p>
                      <p className="text-white/40 text-xs">
                        {new Date(item.scheduled_for).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · {item.platform}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={item.status} />
                    {item.status === "pending" && (
                      <button
                        onClick={() => cancelPost(item.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/20 text-red-400"
                        title="Cancel post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === "schedule" && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-white">Weekly Posting Schedule</h2>
              <p className="text-white/40 text-sm mt-0.5">Toggle days ON/OFF and pick posting times. AI will fill slots automatically.</p>
            </div>
            <button
              onClick={saveSchedule}
              disabled={savingSchedule}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#BE32FF] to-[#F0449B] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
            >
              {savingSchedule ? <Loader2 className="w-4 h-4 animate-spin" /> : scheduleSaved ? <CheckCircle2 className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              {savingSchedule ? "Saving..." : scheduleSaved ? "Saved!" : "Save Schedule"}
            </button>
          </div>

          <div className="grid gap-3">
            {DAYS.map(day => {
              const isActive = day in schedule;
              const time = schedule[day]?.[0] ?? "11:00";
              return (
                <div
                  key={day}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    isActive
                      ? "bg-[#BE32FF]/10 border-[#BE32FF]/40"
                      : "bg-white/[0.02] border-white/8 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Toggle button */}
                    <button
                      onClick={() => toggleDayInSchedule(day)}
                      className={`w-10 h-5 rounded-full relative transition-all duration-300 flex-shrink-0 ${isActive ? "bg-gradient-to-r from-[#BE32FF] to-[#F0449B]" : "bg-white/15"}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${isActive ? "left-5" : "left-0.5"}`} />
                    </button>
                    <span className="text-lg">{DAY_EMOJIS[day]}</span>
                    <span className={`font-semibold text-sm ${isActive ? "text-white" : "text-white/40"}`}>{day}</span>
                  </div>

                  {isActive && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <Clock className="w-4 h-4" />
                        <input
                          type="time"
                          value={time}
                          onChange={e => updateDayTime(day, e.target.value)}
                          className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#BE32FF]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Example schedule preview */}
          <div className="mt-6 p-5 bg-white/[0.02] border border-white/10 rounded-xl">
            <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2"><Flame className="w-4 h-4 text-[#F0449B]" /> Preview: This Week</h3>
            <div className="space-y-2">
              {Object.entries(schedule).map(([day, times]) => (
                <div key={day} className="flex items-center gap-3 text-sm">
                  <span className="text-white/40 w-24">{day}</span>
                  <ChevronRight className="w-3 h-3 text-white/20" />
                  <span className="text-[#BE32FF] font-medium">{times[0]}</span>
                  <span className="text-white/30 text-xs">· AI will auto-generate & post</span>
                </div>
              ))}
              {Object.keys(schedule).length === 0 && (
                <p className="text-white/30 text-sm">No days selected. Toggle days above to activate.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
