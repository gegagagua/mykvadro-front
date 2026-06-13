"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">{t("contact.title")}</h1>
            <p className="text-xl text-muted-foreground">{t("contact.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle>{t("contact.sendMessage")}</CardTitle>
                <CardDescription>{t("contact.formDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t("contact.name")}</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder={t("contact.namePlaceholder")} required />
                  </div>
                  <div>
                    <Label htmlFor="email">{t("contact.email")}</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder={t("contact.emailPlaceholder")} required />
                  </div>
                  <div>
                    <Label htmlFor="subject">{t("contact.subject")}</Label>
                    <Input id="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder={t("contact.subjectPlaceholder")} required />
                  </div>
                  <div>
                    <Label htmlFor="message">{t("contact.message")}</Label>
                    <Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder={t("contact.messagePlaceholder")} rows={5} required />
                  </div>
                  <Button type="submit" className="w-full bg-atv-orange hover:bg-atv-orange-dark">
                    {t("contact.sendButton")}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>{t("contact.getInTouch")}</CardTitle>
                  <CardDescription>{t("contact.channels")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { icon: Mail, label: t("contact.emailLabel"), value: "support@atvtrader.com" },
                    { icon: Phone, label: t("contact.phoneLabel"), value: "1-800-ATV-TRADE" },
                    { icon: MapPin, label: t("contact.addressLabel"), value: "123 ATV Street, Motorsport City" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-atv-orange/10 rounded-lg">
                        <Icon className="h-6 w-6 text-atv-orange" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{label}</h3>
                        <p className="text-muted-foreground">{value}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("contact.businessHours")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>{t("contact.monFri")}</span><span>{t("contact.monFriHours")}</span></div>
                    <div className="flex justify-between"><span>{t("contact.saturday")}</span><span>{t("contact.saturdayHours")}</span></div>
                    <div className="flex justify-between"><span>{t("contact.sunday")}</span><span>{t("contact.sundayHours")}</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
