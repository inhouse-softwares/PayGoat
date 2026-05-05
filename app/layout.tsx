import "./globals.css";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { headers } from "next/headers";
import { PortalChrome } from "./components/portal-chrome";
import { AuthProvider } from "@/lib/auth-context";
import { getSessionRole } from "@/lib/auth";
import { StoreProvider } from "@/lib/store/StoreProvider";
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
  title: "Paygoat Payments Portal",
  description: "Internal dashboard for tracking service payments and transactions.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const role = await getSessionRole();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <StoreProvider>
          <NextTopLoader />
          <AuthProvider initialRole={role}>
            <PortalChrome serverPathname={pathname}>{children}</PortalChrome>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
