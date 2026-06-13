"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";
import { LayoutDashboard, Tag, Package, ShoppingCart, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/services";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/categories", label: "კატეგორიები", icon: Tag },
  { href: "/admin/brands", label: "ბრენდები", icon: Package },
  { href: "/admin/products", label: "პროდუქტები", icon: ShoppingCart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, status, logoutLocal } = useAuthStore();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && user?.user_type !== "admin") {
      router.push("/");
    }
  }, [status, user, router]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
    logoutLocal();
    router.push("/login");
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  if (status === "idle" || status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">იტვირთება...</div>
      </div>
    );
  }

  if (status === "unauthenticated" || user?.user_type !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-atv-orange rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">ATV</span>
            </div>
            <span className="text-xl font-bold text-foreground">Admin</span>
          </Link>
          {user && (
            <p className="text-sm text-muted-foreground mt-2 truncate">{user.email}</p>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(href, exact)
                  ? "bg-atv-orange text-white"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {isActive(href, exact) && <ChevronRight className="h-4 w-4 ml-auto" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            გამოსვლა
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
