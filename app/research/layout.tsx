import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "კვლევა და მიმოხილვები",
  description: "კვადროციკლების მიმოხილვები, შედარებები და გზამკვლევები — აირჩიეთ თქვენთვის სწორი ATV/UTV.",
  path: "/research",
});

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
