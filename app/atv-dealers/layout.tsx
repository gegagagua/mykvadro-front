import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "დილერები",
  description: "კვადროციკლების დილერები და გამყიდველები საქართველოში — იპოვეთ სანდო პარტნიორი თქვენი ATV-ისთვის.",
  path: "/atv-dealers",
});

export default function DealersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
