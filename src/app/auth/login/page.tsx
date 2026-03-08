"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SiAnilist, SiDiscord } from "react-icons/si";
import { Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const ANILIST_CLIENT_ID = process.env.NEXT_PUBLIC_ANILIST_CLIENT_ID ?? "";
const ANILIST_REDIRECT = process.env.NEXT_PUBLIC_ANILIST_REDIRECT_URI ?? "";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"pilih" | "email">("pilih");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginAniList = () => {
    const url = `https://anilist.co/api/v2/oauth/authorize?client_id=${ANILIST_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(ANILIST_REDIRECT)}`;
    window.location.href = url;
  };

  const loginDiscord = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = isRegister
      ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) setError(error.message);
    else router.push("/");
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Image src="/soraku-logo.png" alt="Soraku" width={48} height={48} className="rounded-full mb-3" />
          <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Soraku <span style={{ color: "var(--accent)" }}>Stream</span>
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {mode === "pilih" ? "Pilih cara masuk" : isRegister ? "Buat akun baru" : "Masuk ke akunmu"}
          </p>
        </div>

        {mode === "pilih" ? (
          <div className="flex flex-col gap-3">
            {/* AniList */}
            <button
              onClick={loginAniList}
              className="soraku-btn w-full py-3 justify-center gap-3"
              style={{ backgroundColor: "#2b2d42", color: "#fff" }}
            >
              <SiAnilist size={18} />
              <span>Masuk dengan AniList</span>
            </button>

            {/* Discord */}
            <button
              onClick={loginDiscord}
              className="soraku-btn w-full py-3 justify-center gap-3"
              style={{ backgroundColor: "#5865F2", color: "#fff" }}
            >
              <SiDiscord size={18} />
              <span>Masuk dengan Discord</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2 my-1">
              <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>atau</span>
              <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
            </div>

            {/* Email */}
            <button
              onClick={() => setMode("email")}
              className="soraku-btn w-full py-3 justify-center gap-3"
            >
              <Mail size={18} />
              <span>Masuk dengan Email</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleEmail} className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setMode("pilih")}
              className="flex items-center gap-1 text-xs mb-1 hover:underline w-fit"
              style={{ color: "var(--text-muted)" }}
            >
              <ArrowLeft size={12} /> Kembali
            </button>

            <input
              type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              required className="soraku-input"
            />

            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required className="soraku-input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="soraku-btn soraku-btn-accent w-full py-3 justify-center"
            >
              {loading ? "Memproses..." : isRegister ? "Daftar" : "Masuk"}
            </button>

            <button
              type="button"
              onClick={() => { setIsRegister((v) => !v); setError(""); }}
              className="text-xs text-center hover:underline"
              style={{ color: "var(--accent)" }}
            >
              {isRegister ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
