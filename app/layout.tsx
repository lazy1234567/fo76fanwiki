import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Vault-76 Wiki",
  description: "Community-verified Fallout 76 knowledge base — AI seeded, human approved.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <div className="flex min-h-screen" style={{ paddingTop: '60px' }}>
          <Sidebar />
          <main className="flex-1 ml-0 md:ml-56 p-6 max-w-6xl">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
