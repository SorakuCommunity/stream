import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Soraku Stream | Nonton Anime Online Gratis",
    template: "%s | Soraku Stream",
  },
  description:
    "Platform streaming anime komunitas Soraku — nonton gratis dalam kualitas HD, Sub & Dub. Tanpa iklan.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://stream.soraku.id"
  ),
  openGraph: {
    title: "Soraku Stream",
    description: "Nonton anime online gratis — Soraku Community",
    siteName: "Soraku Stream",
    type: "website",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/soraku-logo.png",
    apple: "/soraku-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Navbar />
          <main style={{ paddingTop: "4rem", minHeight: "100vh" }}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
