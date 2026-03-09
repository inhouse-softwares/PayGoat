import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { PortalChrome } from "./components/portal-chrome";
import { getSessionRole } from "@/lib/auth";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PayGoat Payments Portal",
  description: "Internal dashboard for tracking service payments and transactions.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const role = await getSessionRole();

  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <PortalChrome role={role}>{children}</PortalChrome>
      </body>
    </html>
  );
}
