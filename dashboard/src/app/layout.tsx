import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevOps Copilot | AI-Powered Incident Response",
  description:
    "Autonomous DevOps incident response powered by Archestra MCP platform. Detect, diagnose, and resolve infrastructure incidents with AI agents.",
  keywords: [
    "DevOps",
    "AI",
    "MCP",
    "Archestra",
    "Incident Response",
    "SRE",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-grid min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
