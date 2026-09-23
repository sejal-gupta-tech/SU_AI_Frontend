"use client";
import { useState, useRef, useEffect } from "react";
import { Mic, Plus, MessageSquare, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import agentService from "@/services/agent.service";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  action?: string;
  data?: any;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const WELCOME_MSG: Message = {
  id: "welcome",
  role: "ai",
  content:
    "Namaste! Main UNI AI hoon. Aapko apni marketing ke liye kya banwana hai? (Jaise: 'Diwali ke liye ek mast reel bana do')",
};

function createSession(): ChatSession {
  return {
    id: Date.now().toString(),
    title: "New Chat",
    messages: [WELCOME_MSG],
    createdAt: new Date(),
  };
}

export default function UniAIPage() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => [createSession()]);
  const [activeId, setActiveId] = useState<string>(() => {
    const s = createSession();
    return s.id;
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  // keep activeId in sync with first session on mount
  useEffect(() => {
    setSessions((prev) => {
      setActiveId(prev[0].id);
      return prev;
    });
  }, []);

  const activeSession = sessions.find((s) => s.id === activeId) ?? sessions[0];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, loading]);

  const startNewChat = () => {
    const session = createSession();
    setSessions((prev) => [session, ...prev]);
    setActiveId(session.id);
    setInput("");
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      if (updated.length === 0) {
        const fresh = createSession();
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) setActiveId(updated[0].id);
      return updated;
    });
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice input. Please use Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeId) return s;
        const isFirst = s.messages.filter((m) => m.role === "user").length === 0;
        return {
          ...s,
          title: isFirst ? input.slice(0, 36) + (input.length > 36 ? "…" : "") : s.title,
          messages: [...s.messages, userMsg],
        };
      })
    );
    setInput("");
    setLoading(true);

    try {
      const res = await agentService.sendCommand(userMsg.content);

      let aiContent = "";
      if (res.action === "chat" || !res.success) {
        aiContent = res.message || res.data || "Sorry, I couldn't understand that.";
      } else {
        aiContent = `Ji zaroor! Maine aapke liye ek ${res.action.replace("create_", "")} taiyaar kar diya hai. Kaisa laga?`;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiContent,
        action: res.action,
        data: res.data,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id !== activeId ? s : { ...s, messages: [...s.messages, aiMsg] }
        )
      );
    } catch (e: any) {
      const errMsg =
        e?.response?.data?.message ||
        e?.response?.data?.detail ||
        (e?.response?.status === 401
          ? "Session expire ho gayi. Please login karein."
          : e?.response?.status === 500
          ? "Server error aa gaya. Backend logs check karein."
          : "Network error aa gaya. Phir se try karein.");

      setSessions((prev) =>
        prev.map((s) =>
          s.id !== activeId
            ? s
            : {
                ...s,
                messages: [
                  ...s.messages,
                  { id: (Date.now() + 1).toString(), role: "ai", content: errMsg },
                ],
              }
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const renderDataCard = (action: string, data: any) => {
    if (!data) return null;

    if (action === "create_post") {
      return (
        <div style={{ background: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 12, marginTop: 10, border: "1px solid rgba(255,255,255,0.1)" }}>
          {(data.image_url || data.media_url) && (
            <img src={data.image_url || data.media_url} alt="Generated post" style={{ width: "100%", borderRadius: 8, marginBottom: 12, maxHeight: 300, objectFit: "cover" }} />
          )}
          <h4 style={{ margin: "0 0 8px", color: "#fff" }}>{data.headline}</h4>
          <p style={{ fontSize: 13, color: "#bbb", whiteSpace: "pre-wrap", margin: "0 0 10px" }}>{data.caption}</p>
          {data.call_to_action && <div style={{ color: "#EC4899", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>👉 {data.call_to_action}</div>}
          <div style={{ color: "#7C3AED", fontSize: 12, fontWeight: 700 }}>{data.hashtags?.join(" ")}</div>
        </div>
      );
    }

    if (action === "create_reel") {
      return (
        <div style={{ background: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 12, marginTop: 10, border: "1px solid rgba(255,255,255,0.1)" }}>
          {data.title && <h4 style={{ margin: "0 0 10px", color: "#fff" }}>{data.title}</h4>}
          {data.hook && (
            <div style={{ background: "rgba(245,158,11,0.1)", borderLeft: "3px solid #F59E0B", padding: "8px 12px", borderRadius: 6, marginBottom: 10 }}>
              <span style={{ color: "#F59E0B", fontWeight: 700, fontSize: 12 }}>🎬 HOOK</span>
              <p style={{ margin: "4px 0 0", color: "#fff", fontSize: 13 }}>{data.hook}</p>
            </div>
          )}
          {data.scenes && data.scenes.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ color: "#7C3AED", fontWeight: 700, fontSize: 12, marginBottom: 6 }}>🎥 SCENES</div>
              {data.scenes.map((scene: any) => (
                <div key={scene.scene_number} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "8px 10px", marginBottom: 6 }}>
                  <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>Scene {scene.scene_number} ({scene.duration_seconds}s)</div>
                  <div style={{ color: "#bbb", fontSize: 12, marginBottom: 4 }}>🖼 {scene.visual}</div>
                  <div style={{ color: "#d1d5db", fontSize: 12 }}>🎤 {scene.voiceover}</div>
                  {scene.on_screen_text && <div style={{ color: "#10B981", fontSize: 11, marginTop: 4 }}>📝 {scene.on_screen_text}</div>}
                </div>
              ))}
            </div>
          )}
          {data.cta && <div style={{ color: "#EC4899", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>👉 CTA: {data.cta}</div>}
          {data.caption && <p style={{ fontSize: 12, color: "#bbb", margin: "0 0 8px" }}>{data.caption}</p>}
          {data.hashtags && data.hashtags.length > 0 && <div style={{ color: "#7C3AED", fontSize: 12, fontWeight: 700 }}>{data.hashtags.join(" ")}</div>}
        </div>
      );
    }

    if (action === "generate_festival_campaign") {
      return (
        <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(236,72,153,0.1))", padding: 16, borderRadius: 12, marginTop: 10, border: "1px solid rgba(124,58,237,0.3)" }}>
          <h4 style={{ margin: "0 0 8px", color: "#fff" }}>{data.festival_emoji} {data.festival_name} Campaign Generated!</h4>
          <p style={{ fontSize: 13, color: "#bbb", margin: 0 }}>Check the Festivals tab to view all {data.assets?.length} assets and schedule them.</p>
        </div>
      );
    }

    return null;
  };

  const formatTime = (d: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(d).toLocaleDateString();
  };

  return (
    <div style={{ height: "calc(100vh - 64px)", display: "flex", background: "#0a0a14", position: "relative", overflow: "hidden" }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: sidebarOpen ? 260 : 0,
        minWidth: sidebarOpen ? 260 : 0,
        transition: "width 0.3s ease, min-width 0.3s ease",
        overflow: "hidden",
        background: "#0f0f1c",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        {/* Sidebar header */}
        <div style={{ padding: "16px 14px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={startNewChat}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              background: "linear-gradient(135deg,#7C3AED,#EC4899)",
              border: "none",
              borderRadius: 10,
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>

        {/* History label */}
        <div style={{ padding: "12px 16px 6px", fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
          History
        </div>

        {/* Session list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 16px" }}>
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => setActiveId(s.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 10px",
                borderRadius: 10,
                marginBottom: 4,
                cursor: "pointer",
                background: s.id === activeId ? "rgba(124,58,237,0.18)" : "transparent",
                border: s.id === activeId ? "1px solid rgba(124,58,237,0.35)" : "1px solid transparent",
                transition: "all 0.15s",
              }}
            >
              <MessageSquare size={14} color={s.id === activeId ? "#a78bfa" : "#555"} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ color: s.id === activeId ? "#e0d4ff" : "#aaa", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {s.title}
                </div>
                <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>{formatTime(s.createdAt)}</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#444", padding: 2, flexShrink: 0, borderRadius: 4, display: "flex", alignItems: "center" }}
                title="Delete chat"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sidebar toggle ── */}
      <button
        onClick={() => setSidebarOpen((v) => !v)}
        title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        style={{
          position: "absolute",
          top: "50%",
          left: sidebarOpen ? 248 : 0,
          transform: "translateY(-50%)",
          zIndex: 10,
          background: "#1a1a2e",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "0 8px 8px 0",
          color: "#888",
          padding: "8px 5px",
          cursor: "pointer",
          transition: "left 0.3s ease",
          display: "flex",
          alignItems: "center",
        }}
      >
        {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* ── Main chat area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#11111a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: "linear-gradient(135deg,#7C3AED,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
              🤖
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 18, color: "#fff", fontWeight: 700 }}>UNI AI Assistant</h1>
              <p style={{ margin: 0, fontSize: 12, color: "#888" }}>Speaks Hindi & Hinglish natively</p>
            </div>
          </div>
          <button
            onClick={startNewChat}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.4)",
              borderRadius: 10,
              color: "#a78bfa",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <Plus size={14} />
            New Chat
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {activeSession?.messages.map((msg) => (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div
                style={{
                  maxWidth: "75%",
                  padding: "14px 18px",
                  borderRadius: msg.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                  background: msg.role === "user" ? "#7C3AED" : "#1a1a24",
                  color: "#fff",
                  fontSize: 15,
                  lineHeight: 1.5,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                {msg.content}
                {msg.action && renderDataCard(msg.action, msg.data)}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <div style={{ padding: "14px 18px", borderRadius: "20px 20px 20px 4px", background: "#1a1a24", color: "#888", fontSize: 14, display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#7C3AED", display: "inline-block", animation: `uniTyping 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                </span>
                UNI AI is typing...
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "20px 24px", background: "#11111a", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", gap: 12, background: "rgba(255,255,255,0.05)", padding: 8, borderRadius: 30, border: "1px solid rgba(255,255,255,0.1)" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your command in Hindi/Hinglish (e.g. Mere liye ek ad bana do)..."
              style={{ flex: 1, background: "transparent", border: "none", color: "#fff", padding: "0 16px", outline: "none", fontSize: 15 }}
            />
            <button
              type="button"
              onClick={startListening}
              title="Use voice input"
              style={{
                background: isListening ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.1)",
                border: isListening ? "1px solid rgba(239,68,68,0.4)" : "none",
                borderRadius: "50%",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isListening ? "#ef4444" : "#fff",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {isListening ? <span style={{ fontSize: 11, fontWeight: 700 }}>●</span> : <Mic size={20} />}
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              style={{
                background: "linear-gradient(135deg,#7C3AED,#EC4899)",
                border: "none",
                borderRadius: 24,
                padding: "0 24px",
                color: "#fff",
                fontWeight: 600,
                cursor: !input.trim() || loading ? "not-allowed" : "pointer",
                opacity: !input.trim() || loading ? 0.5 : 1,
                flexShrink: 0,
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes uniTyping {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}


interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  action?: string;
  data?: any;
}

export default function UniAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Namaste! Main UNI AI hoon. Aapko apni marketing ke liye kya banwana hai? (Jaise: 'Diwali ke liye ek mast reel bana do')",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support voice input. Please use Chrome.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await agentService.sendCommand(userMsg.content);
      
      let aiContent = "";
      if (res.action === "chat" || !res.success) {
        aiContent = res.message || res.data || "Sorry, I couldn't understand that.";
      } else {
        aiContent = `Ji zaroor! Maine aapke liye ek ${res.action.replace("create_", "")} taiyaar kar diya hai. Kaisa laga?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: aiContent,
          action: res.action,
          data: res.data,
        },
      ]);
    } catch (e: any) {
      const errMsg =
        e?.response?.data?.message ||
        e?.response?.data?.detail ||
        (e?.response?.status === 401 ? "Session expire ho gayi. Please login karein." :
         e?.response?.status === 500 ? "Server error aa gaya. Backend logs check karein." :
         "Network error aa gaya. Phir se try karein.");
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: errMsg,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderDataCard = (action: string, data: any) => {
    if (!data) return null;

    if (action === "create_post") {
      return (
        <div style={{ background: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 12, marginTop: 10, border: "1px solid rgba(255,255,255,0.1)" }}>
          {(data.image_url || data.media_url) && (
            <img
              src={data.image_url || data.media_url}
              alt="Generated post"
              style={{ width: "100%", borderRadius: 8, marginBottom: 12, maxHeight: 300, objectFit: "cover" }}
            />
          )}
          <h4 style={{ margin: "0 0 8px", color: "#fff" }}>{data.headline}</h4>
          <p style={{ fontSize: 13, color: "#bbb", whiteSpace: "pre-wrap", margin: "0 0 10px" }}>{data.caption}</p>
          {data.call_to_action && (
            <div style={{ color: "#EC4899", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>👉 {data.call_to_action}</div>
          )}
          <div style={{ color: "#7C3AED", fontSize: 12, fontWeight: 700 }}>{data.hashtags?.join(" ")}</div>
        </div>
      );
    }

    if (action === "create_reel") {
      return (
        <div style={{ background: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 12, marginTop: 10, border: "1px solid rgba(255,255,255,0.1)" }}>
          {data.title && <h4 style={{ margin: "0 0 10px", color: "#fff" }}>{data.title}</h4>}
          {data.hook && (
            <div style={{ background: "rgba(245,158,11,0.1)", borderLeft: "3px solid #F59E0B", padding: "8px 12px", borderRadius: 6, marginBottom: 10 }}>
              <span style={{ color: "#F59E0B", fontWeight: 700, fontSize: 12 }}>🎬 HOOK</span>
              <p style={{ margin: "4px 0 0", color: "#fff", fontSize: 13 }}>{data.hook}</p>
            </div>
          )}
          {data.scenes && data.scenes.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ color: "#7C3AED", fontWeight: 700, fontSize: 12, marginBottom: 6 }}>🎥 SCENES</div>
              {data.scenes.map((scene: any) => (
                <div key={scene.scene_number} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "8px 10px", marginBottom: 6 }}>
                  <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>Scene {scene.scene_number} ({scene.duration_seconds}s)</div>
                  <div style={{ color: "#bbb", fontSize: 12, marginBottom: 4 }}>🖼 {scene.visual}</div>
                  <div style={{ color: "#d1d5db", fontSize: 12 }}>🎤 {scene.voiceover}</div>
                  {scene.on_screen_text && <div style={{ color: "#10B981", fontSize: 11, marginTop: 4 }}>📝 {scene.on_screen_text}</div>}
                </div>
              ))}
            </div>
          )}
          {data.cta && (
            <div style={{ color: "#EC4899", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>👉 CTA: {data.cta}</div>
          )}
          {data.caption && (
            <p style={{ fontSize: 12, color: "#bbb", margin: "0 0 8px" }}>{data.caption}</p>
          )}
          {data.hashtags && data.hashtags.length > 0 && (
            <div style={{ color: "#7C3AED", fontSize: 12, fontWeight: 700 }}>{data.hashtags.join(" ")}</div>
          )}
        </div>
      );
    }

    if (action === "generate_festival_campaign") {
      return (
        <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(236,72,153,0.1))", padding: 16, borderRadius: 12, marginTop: 10, border: "1px solid rgba(124,58,237,0.3)" }}>
          <h4 style={{ margin: "0 0 8px", color: "#fff" }}>{data.festival_emoji} {data.festival_name} Campaign Generated!</h4>
          <p style={{ fontSize: 13, color: "#bbb", margin: 0 }}>Check the Festivals tab to view all {data.assets?.length} assets and schedule them.</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column", background: "#0a0a14" }}>
      
      <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#11111a", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: "linear-gradient(135deg,#7C3AED,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
          {"🤖"}
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, color: "#fff", fontWeight: 700 }}>UNI AI Assistant</h1>
          <p style={{ margin: 0, fontSize: 12, color: "#888" }}>Speaks Hindi & Hinglish natively</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div
              style={{
                maxWidth: "75%",
                padding: "14px 18px",
                borderRadius: msg.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                background: msg.role === "user" ? "#7C3AED" : "#1a1a24",
                color: "#fff",
                fontSize: 15,
                lineHeight: 1.5,
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              {msg.content}
              {msg.action && renderDataCard(msg.action, msg.data)}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div style={{ padding: "14px 18px", borderRadius: "20px 20px 20px 4px", background: "#1a1a24", color: "#888", fontSize: 14 }}>
              UNI AI is typing...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ padding: "20px 24px", background: "#11111a", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", gap: 12, background: "rgba(255,255,255,0.05)", padding: 8, borderRadius: 30, border: "1px solid rgba(255,255,255,0.1)" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your command in Hindi/Hinglish (e.g. Mere liye ek ad bana do)..."
            style={{ flex: 1, background: "transparent", border: "none", color: "#fff", padding: "0 16px", outline: "none", fontSize: 15 }}
          />
          <button
            type="button"
            onClick={startListening}
            title="Use voice input"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            {isListening ? <span style={{color: "#ef4444", animation: "pulse 1.5s infinite"}}>Listening...</span> : <Mic size={20} />}
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            style={{
              background: "linear-gradient(135deg,#7C3AED,#EC4899)",
              border: "none",
              borderRadius: 24,
              padding: "0 24px",
              color: "#fff",
              fontWeight: 600,
              cursor: (!input.trim() || loading) ? "not-allowed" : "pointer",
              opacity: (!input.trim() || loading) ? 0.5 : 1,
            }}
          >
            Send
          </button>
        </div>
      </div>

    </div>
  );
}




