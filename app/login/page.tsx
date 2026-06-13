"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { SignIn } from "@/services";
import { useAuthStore } from "@/store/auth";

export default function Login() {
  const { setUser, setStatus } = useAuthStore();
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError("");
    setLoading(true);
    try {
      const res = await SignIn(email, password);
      if (res?.data) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        setStatus("authenticated");
        router.push(res.data.user?.user_type === "admin" ? "/admin" : "/");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg || "ელ-ფოსტა ან პაროლი არასწორია");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16">
        <div className="max-w-md mx-auto px-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">{t("login.title")}</CardTitle>
              <CardDescription>{t("login.title")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">{t("login.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("login.email")}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">{t("login.password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("login.password")}
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-atv-orange hover:bg-atv-orange-dark"
                  disabled={loading}
                >
                  {loading ? "იტვირთება..." : t("login.button")}
                </Button>
              </form>
              <div className="mt-6 text-center space-y-2">
                <Link href="/forgot-password" className="text-sm text-atv-orange hover:underline">
                  {t("login.forgotPassword")}
                </Link>
                <div className="text-sm text-muted-foreground">
                  {t("login.noAccount")}{" "}
                  <Link href="/signup" className="text-atv-orange hover:underline">
                    {t("login.signUp")}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
