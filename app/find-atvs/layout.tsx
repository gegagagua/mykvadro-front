import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "კვადროციკლები",
  description:
    "მოძებნეთ კვადროციკლი (ATV/UTV) საქართველოში — გაფილტრეთ ბრენდის, კატეგორიის, ფასისა და ლოკაციის მიხედვით.",
  path: "/find-atvs",
});

export default function FindAtvsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
