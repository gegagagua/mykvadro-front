import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "სიახლეები",
  description:
    "კვადროციკლების სიახლეები, რჩევები და გზამკვლევები — ახალი მოდელები, ტურები საქართველოში, უსაფრთხოება, რეგისტრაცია და მოვლა.",
  path: "/blog",
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
