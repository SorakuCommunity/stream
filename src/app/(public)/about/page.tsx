import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tentang | Soraku Stream" };

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Tentang</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--accent)" }}>Apa itu Soraku Stream?</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Soraku Stream adalah platform streaming anime gratis milik komunitas{" "}
          <strong style={{ color: "var(--text-primary)" }}>Soraku Community</strong> — komunitas
          anime & budaya Jepang Indonesia. Nonton anime dalam kualitas HD dengan subtitle Inggris
          atau dubbing, tanpa iklan.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--accent)" }}>Mengapa Soraku Stream?</h2>
        <ul className="flex flex-col gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          {[
            "✅ Perpustakaan anime lengkap — lama maupun terbaru",
            "✅ Streaming cepat dan stabil dengan multi-server",
            "✅ HD quality, bisa disesuaikan dengan kecepatan internet",
            "✅ Auto-skip intro/outro, lanjut otomatis, putar otomatis",
            "✅ Sinkronisasi AniList otomatis",
            "✅ Tanpa iklan, tanpa malware",
            "✅ Desktop & mobile friendly",
            "✅ Komunitas aktif pecinta anime Indonesia",
          ].map((item) => (
            <li key={item} className="leading-relaxed">{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--accent)" }}>Tentang Soraku Community</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Soraku adalah komunitas terbuka non-profit yang lahir dari kecintaan terhadap pop Jepang
          dan budaya Jepang di Indonesia. Kata "Sora" berarti langit — ruang tanpa batas yang
          mengangkat semua orang bersama. Dari penggemar baru hingga wibu veteran, semua bisa
          bergabung untuk belajar, berbagi, dan tumbuh bersama.
        </p>
      </section>
    </div>
  );
}
