import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "გაყიდე შენი კვადროციკლი",
  description: "განათავსეთ თქვენი კვადროციკლის (ATV/UTV) განცხადება MyKvadro-ზე და მიაღწიეთ მყიდველებს მთელ საქართველოში.",
  path: "/sell-my-atv",
});

export default function SellLayout({ children }: { children: React.ReactNode }) {
  return children;
}
