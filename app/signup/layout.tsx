import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "რეგისტრაცია",
  description: "შექმენით MyKvadro ანგარიში და დაიწყეთ კვადროციკლების ყიდვა-გაყიდვა.",
  path: "/signup",
});

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
