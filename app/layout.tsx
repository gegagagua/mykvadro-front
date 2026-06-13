import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "MyKvadro — კვადროციკლების ყიდვა-გაყიდვა",
    template: "%s | MyKvadro",
  },
  description:
    "MyKvadro — საქართველოს კვადროციკლების (ATV/UTV) მარკეტი. იყიდე, გაყიდე და მოძებნე ახალი და მეორადი კვადროციკლები საუკეთესო ფასად.",
  keywords: ["კვადროციკლი", "ATV", "UTV", "ქვადრო", "Side-by-Side", "MyKvadro", "Georgia ATV"],
  applicationName: "MyKvadro",
  authors: [{ name: "MyKvadro" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "MyKvadro",
    title: "MyKvadro — კვადროციკლების ყიდვა-გაყიდვა",
    description: "საქართველოს კვადროციკლების მარკეტი — იყიდე, გაყიდე, მოძებნე.",
    url: SITE,
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: "MyKvadro" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyKvadro — კვადროციკლების ყიდვა-გაყიდვა",
    description: "საქართველოს კვადროციკლების მარკეტი.",
    images: ["/og-default.svg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka">
      <body className="min-h-screen bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
