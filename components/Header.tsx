"use client";

import { Search, User, Menu, LogOut, LayoutDashboard, ClipboardList, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuthStore } from "@/store/auth";
import { logout } from "@/services";

export const Header = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const { user, logoutLocal } = useAuthStore();

  const handleLogout = async () => {
    try { await logout(); } catch {}
    logoutLocal();
    router.push("/login");
  };

  return (
    <header className="bg-background border-b border-atv-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-atv-orange rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">ATV</span>
              </div>
              <span className="text-xl font-bold text-foreground">Trader</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/find-atvs" className="text-foreground hover:text-atv-orange font-medium">
              {t("nav.findATVs")}
            </Link>
            <Link href="/atv-dealers" className="text-foreground hover:text-atv-orange font-medium">
              {t("nav.atvDealers")}
            </Link>
            <Link href="/blog" className="text-foreground hover:text-atv-orange font-medium">
              {t("nav.blog")}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2">
              <Input type="text" placeholder={t("nav.search")} className="w-64" />
              <Button size="sm" className="bg-atv-orange hover:bg-atv-orange-dark">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <LanguageSwitcher />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline max-w-32 truncate">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      პროფილი
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      ჩემი განცხადებები
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/sell-my-atv" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      განცხადების დამატება
                    </Link>
                  </DropdownMenuItem>
                  {user.user_type === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          ადმინ პანელი
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4" />
                    გამოსვლა
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" className="flex items-center gap-1" asChild>
                <Link href="/login">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("nav.login")}</span>
                </Link>
              </Button>
            )}

            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
