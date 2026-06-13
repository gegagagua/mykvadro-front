import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "კონტაქტი",
  description: "დაგვიკავშირდით MyKvadro-ს გუნდს — კითხვები, შემოთავაზებები და მხარდაჭერა კვადროციკლების ყიდვა-გაყიდვაში.",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
