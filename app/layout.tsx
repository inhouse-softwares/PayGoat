import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { PortalChrome } from "./components/portal-chrome";
import { getSessionRole } from "@/lib/auth";
import { StoreProvider } from "@/lib/store/StoreProvider";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";

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
        <StoreProvider>
          <NextTopLoader />
          <PortalChrome role={role}>{children}</PortalChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
