"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { SignUp } from "@/services";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function Signup() {
  const { t } = useLanguage();
  const router = useRouter();
  const { setUser, setStatus } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeToTerms: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("პაროლები არ ემთხვევა");
      return;
    }
    setError("");
    try {
      const res = await SignUp({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });
      if (res?.data) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        setStatus("authenticated");
        router.push("/profile");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors;
      setError(typeof msg === "string" ? msg : "რეგისტრაცია ვერ მოხდა");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16">
        <div className="max-w-lg mx-auto px-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">{t("signup.title")}</CardTitle>
              <CardDescription>{t("signup.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t("signup.firstName")}</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder={t("signup.firstNamePlaceholder")}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t("signup.lastName")}</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder={t("signup.lastNamePlaceholder")}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">{t("signup.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder={t("signup.emailPlaceholder")}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t("signup.phone")}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder={t("signup.phonePlaceholder")}
                  />
                </div>
                <div>
                  <Label htmlFor="password">{t("signup.password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder={t("signup.passwordPlaceholder")}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">{t("signup.confirmPassword")}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder={t("signup.confirmPasswordPlaceholder")}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    {t("signup.agreeToTerms")}{" "}
                    <Link href="/terms" className="text-atv-orange hover:underline">
                      {t("signup.termsOfService")}
                    </Link>{" "}
                    {t("signup.and")}{" "}
                    <Link href="/privacy" className="text-atv-orange hover:underline">
                      {t("signup.privacyPolicy")}
                    </Link>
                  </Label>
                </div>
                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-atv-orange hover:bg-atv-orange-dark"
                  disabled={!formData.agreeToTerms}
                >
                  {t("signup.button")}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <div className="text-sm text-muted-foreground">
                  {t("signup.haveAccount")}{" "}
                  <Link href="/login" className="text-atv-orange hover:underline">
                    {t("signup.login")}
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
