import type { Metadata } from "next";
import "./globals.css";
import { IssueStoreProvider } from "@/lib/issueStore";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export const metadata: Metadata = {
  title: "Aegis City — ARIA Command Center",
  description: "AI-powered Smart City Command Center featuring Explainable AI, Digital Twin simulations, predictive analytics, and real-time emergency response coordination.",
  keywords: ["smart city", "AI governance", "ARIA", "Aegis City", "command center"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <IssueStoreProvider>
          <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-deep)" }}>
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main
                className="flex-1 overflow-y-auto p-6 grid-bg"
                style={{ background: "var(--bg-deep)" }}
              >
                {children}
              </main>
            </div>
          </div>
        </IssueStoreProvider>
      </body>
    </html>
  );
}
