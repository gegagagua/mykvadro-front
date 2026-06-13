import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "კონფიდენციალურობის პოლიტიკა",
  description: "MyKvadro-ს კონფიდენციალურობის პოლიტიკა — როგორ ვაგროვებთ და ვიყენებთ თქვენს მონაცემებს.",
  path: "/privacy",
});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
