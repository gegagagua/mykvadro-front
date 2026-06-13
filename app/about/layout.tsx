import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "ჩვენ შესახებ",
  description:
    "MyKvadro — საქართველოს კვადროციკლების (ATV/UTV) მარკეტი. გაიგეთ მეტი ჩვენი მისიისა და სერვისის შესახებ.",
  path: "/about",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
