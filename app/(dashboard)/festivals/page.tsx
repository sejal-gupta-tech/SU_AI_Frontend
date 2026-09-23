"use client";
import { useState, useEffect, useCallback } from "react";
import festivalService, {
  FestivalCampaign,
  UpcomingFestival,
  FestivalAsset,
} from "@/services/festival.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function typeLabel(type: string) {
  const map: Record<string, string> = {
    post: "📸 Post",
    reel: "🎬 Reel",
    ad: "📢 Ad",
    whatsapp: "💬 WhatsApp",
  };
  return map[type] ?? type;
}

function platformColor(platform: string) {
  const map: Record<string, string> = {
    instagram: "#E1306C",
    facebook: "#1877F2",
    whatsapp: "#25D366",
    meta: "#0082FB",
  };
  return map[platform] ?? "#888";
}

// ─── Asset Card ───────────────────────────────────────────────────────────────

function AssetCard({ asset }: { asset: FestivalAsset }) {
  const c = asset.content;
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        borderRadius: 12,
        padding: "14px 16px",
        marginBottom: 10,
        borderLeft: `3px solid ${platformColor(asset.platform)}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
          {typeLabel(asset.type)}
        </span>
        <span
          style={{
            fontSize: 11,
            background: platformColor(asset.platform) + "33",
            color: platformColor(asset.platform),
            borderRadius: 20,
            padding: "2px 8px",
            fontWeight: 600,
          }}
        >
          {asset.platform} · Day {asset.day}
        </span>
      </div>
      {c.headline && (
        <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 4 }}>
          {c.headline}
        </div>
      )}
      {c.hook && (
        <div style={{ fontWeight: 700, color: "#FFD700", fontSize: 14, marginBottom: 4 }}>
          🎣 {c.hook}
        </div>
      )}
      {c.body && (
        <div style={{ color: "#bbb", fontSize: 12, lineHeight: 1.5 }}>{c.body}</div>
      )}
      {c.script && (
        <div style={{ color: "#bbb", fontSize: 12, lineHeight: 1.5 }}>{c.script}</div>
      )}
      {c.message && (
        <div style={{ color: "#bbb", fontSize: 12, lineHeight: 1.5 }}>{c.message}</div>
      )}
      {c.primary_text && (
        <div style={{ color: "#bbb", fontSize: 12, lineHeight: 1.5 }}>{c.primary_text}</div>
      )}
      {c.cta && (
        <div
          style={{
            marginTop: 6,
            fontSize: 11,
            color: "#fff",
            background: "#7C3AED",
            display: "inline-block",
            borderRadius: 20,
            padding: "2px 10px",
          }}
        >
          {c.cta}
        </div>
      )}
      {c.scheduled_date && (
        <div style={{ marginTop: 6, fontSize: 11, color: "#777" }}>
          📅 {asset.scheduled_date}
        </div>
      )}
    </div>
  );
}

// ─── Campaign Detail Modal ─────────────────────────────────────────────────────

function CampaignModal({
  campaign,
  onClose,
  onApprove,
  onDelete,
  loading,
}: {
  campaign: FestivalCampaign;
  onClose: () => void;
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#1a1a2e",
          borderRadius: 20,
          width: "100%",
          maxWidth: 720,
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(135deg,#7C3AED22,#EC489922)",
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: "#fff", fontSize: 20, fontWeight: 700 }}>
              {campaign.festival_emoji} {campaign.festival_name} Campaign
            </h2>
            <p style={{ margin: "4px 0 0", color: "#aaa", fontSize: 13 }}>
              Festival Date: {campaign.festival_date} · {campaign.days_left} days away
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#fff",
              borderRadius: 8,
              padding: "6px 12px",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            ✕
          </button>
        </div>

        {/* Offer Strategy */}
        <div
          style={{
            margin: "16px 24px 0",
            background: "rgba(255,215,0,0.1)",
            border: "1px solid rgba(255,215,0,0.3)",
            borderRadius: 10,
            padding: "12px 14px",
          }}
        >
          <span style={{ fontSize: 12, color: "#FFD700", fontWeight: 600 }}>💡 Offer Strategy</span>
          <p style={{ margin: "4px 0 0", color: "#ffe", fontSize: 13 }}>{campaign.offer_strategy}</p>
        </div>

        {/* Assets */}
        <div style={{ overflowY: "auto", flex: 1, padding: "16px 24px" }}>
          <p style={{ color: "#888", fontSize: 12, margin: "0 0 12px" }}>
            {campaign.assets.length} assets · Posts, Reels, Ads & WhatsApp
          </p>
          {campaign.assets.map((a) => (
            <AssetCard key={a.id} asset={a} />
          ))}
        </div>

        {/* Actions */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            gap: 10,
          }}
        >
          {campaign.status === "draft" && (
            <>
              <button
                onClick={() => onApprove(campaign.id)}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: loading
                    ? "#555"
                    : "linear-gradient(135deg,#7C3AED,#EC4899)",
                  border: "none",
                  borderRadius: 10,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Scheduling..." : "✅ Approve & Schedule Campaign"}
              </button>
              <button
                onClick={() => onDelete(campaign.id)}
                disabled={loading}
                style={{
                  padding: "12px 16px",
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.4)",
                  borderRadius: 10,
                  color: "#EF4444",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                🗑️ Delete
              </button>
            </>
          )}
          {campaign.status === "approved" && (
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px",
                background: "rgba(34,197,94,0.15)",
                border: "1px solid rgba(34,197,94,0.4)",
                borderRadius: 10,
                color: "#22C55E",
                fontWeight: 700,
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              ✅ Campaign Approved & Scheduled in Autopilot!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function FestivalsPage() {
  const [upcomingFestivals, setUpcomingFestivals] = useState<UpcomingFestival[]>([]);
  const [campaigns, setCampaigns] = useState<FestivalCampaign[]>([]);
  const [selected, setSelected] = useState<FestivalCampaign | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [actioning, setActioning] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(true);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await festivalService.getUpcoming();
      setUpcomingFestivals(data.upcoming_festivals);
      setCampaigns(data.campaigns);
    } catch {
      showToast("Failed to load festivals", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGenerate = async (festivalName: string) => {
    setGenerating(festivalName);
    try {
      const campaign = await festivalService.generateCampaign(festivalName);
      if (campaign) {
        setCampaigns((prev) => [campaign, ...prev]);
        setSelected(campaign);
        showToast(`🎉 ${festivalName} campaign generated!`);
      } else {
        showToast("AI generation failed, please try again.", "error");
      }
    } catch {
      showToast("Generation failed.", "error");
    } finally {
      setGenerating(null);
    }
  };

  const handleApprove = async (campaignId: string) => {
    setActioning(true);
    try {
      const res = await festivalService.approveCampaign(campaignId);
      showToast(res.message || "Campaign scheduled!");
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? { ...c, status: "approved" } : c))
      );
      if (selected?.id === campaignId) setSelected((s) => s ? { ...s, status: "approved" } : null);
    } catch {
      showToast("Approval failed.", "error");
    } finally {
      setActioning(false);
    }
  };

  const handleDelete = async (campaignId: string) => {
    setActioning(true);
    try {
      await festivalService.deleteCampaign(campaignId);
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      setSelected(null);
      showToast("Campaign deleted.");
    } catch {
      showToast("Delete failed.", "error");
    } finally {
      setActioning(false);
    }
  };

  const getCampaignForFestival = (name: string, date: string) =>
    campaigns.find((c) => c.festival_name === name && c.festival_date === date) ?? null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f1a",
        padding: "28px 24px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            padding: "12px 20px",
            borderRadius: 10,
            background: toast.type === "success" ? "#22C55E" : "#EF4444",
            color: "#fff",
            fontWeight: 600,
            fontSize: 14,
            boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <CampaignModal
          campaign={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onDelete={handleDelete}
          loading={actioning}
        />
      )}

      {/* Hero */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 800,
            background: "linear-gradient(135deg,#f97316,#ec4899,#7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          🎉 Indian Festival Engine
        </h1>
        <p style={{ color: "#888", margin: "6px 0 0", fontSize: 14 }}>
          AI detects upcoming festivals and generates complete 10-day marketing campaigns for your business.
        </p>
      </div>

      {loading ? (
        <div style={{ color: "#888", textAlign: "center", marginTop: 60 }}>
          Loading festivals...
        </div>
      ) : (
        <>
          {/* Upcoming festivals grid */}
          <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
            📅 Upcoming Festivals (Next 30 Days)
          </h2>
          {upcomingFestivals.length === 0 ? (
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: 14,
                padding: "28px",
                textAlign: "center",
                color: "#666",
                marginBottom: 32,
              }}
            >
              No major Indian festivals in the next 30 days. Check back soon!
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
                gap: 14,
                marginBottom: 36,
              }}
            >
              {upcomingFestivals.map((f) => {
                const existing = getCampaignForFestival(f.name, f.date);
                const isGenerating = generating === f.name;
                return (
                  <div
                    key={f.name + f.date}
                    style={{
                      background: existing
                        ? "rgba(124,58,237,0.15)"
                        : "rgba(255,255,255,0.05)",
                      border: existing
                        ? "1px solid rgba(124,58,237,0.5)"
                        : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 16,
                      padding: "18px 16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div style={{ fontSize: 32 }}>{f.emoji}</div>
                    <div style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>
                      {f.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      {f.date} · {f.days_left === 0 ? "🔴 Today!" : `${f.days_left} days away`}
                    </div>
                    {existing ? (
                      <button
                        onClick={() => setSelected(existing)}
                        style={{
                          marginTop: 4,
                          padding: "8px",
                          background: "rgba(124,58,237,0.3)",
                          border: "1px solid #7C3AED",
                          borderRadius: 8,
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        {existing.status === "approved" ? "✅ Approved" : "📋 View Campaign"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleGenerate(f.name)}
                        disabled={isGenerating}
                        style={{
                          marginTop: 4,
                          padding: "8px",
                          background: isGenerating
                            ? "rgba(255,255,255,0.08)"
                            : "linear-gradient(135deg,#7C3AED,#EC4899)",
                          border: "none",
                          borderRadius: 8,
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: isGenerating ? "not-allowed" : "pointer",
                        }}
                      >
                        {isGenerating ? "✨ Generating..." : "✨ Generate Campaign"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Existing campaigns */}
          {campaigns.length > 0 && (
            <>
              <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
                🗂️ Your Festival Campaigns
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {campaigns.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelected(c)}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 14,
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(124,58,237,0.12)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
                    }
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 24 }}>{c.festival_emoji || "🎉"}</span>
                      <div>
                        <div style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>
                          {c.festival_name}
                        </div>
                        <div style={{ color: "#888", fontSize: 12 }}>
                          {c.assets.length} assets · {c.festival_date}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: 20,
                        background:
                          c.status === "approved"
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(249,115,22,0.15)",
                        color: c.status === "approved" ? "#22C55E" : "#F97316",
                        border: `1px solid ${c.status === "approved" ? "#22C55E44" : "#F9731644"}`,
                      }}
                    >
                      {c.status === "approved" ? "✅ Approved" : "📝 Draft"}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
