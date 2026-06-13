"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award, Globe } from "lucide-react";

export default function About() {
  const { t } = useLanguage();

  const features = [
    { icon: Users, title: t("about.communityFirst"), description: t("about.communityFirstDesc") },
    { icon: Target, title: t("about.trustedMarketplace"), description: t("about.trustedMarketplaceDesc") },
    { icon: Award, title: t("about.qualityGuaranteed"), description: t("about.qualityGuaranteedDesc") },
    { icon: Globe, title: t("about.nationwideReach"), description: t("about.nationwideReachDesc") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-6">{t("about.title")}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("about.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">{t("about.ourStory")}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{t("about.storyP1")}</p>
                <p>{t("about.storyP2")}</p>
                <p>{t("about.storyP3")}</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">{t("about.ourMission")}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{t("about.missionP1")}</p>
                <p>{t("about.missionP2")}</p>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">{t("about.whyChoose")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-center w-16 h-16 bg-atv-orange/10 rounded-lg mx-auto mb-4">
                        <Icon className="h-8 w-8 text-atv-orange" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="bg-atv-orange/5 rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">{t("about.byTheNumbers")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "50K+", label: t("about.activeListings") },
                { value: "1M+", label: t("about.registeredUsers") },
                { value: "500+", label: t("about.verifiedDealers") },
                { value: "15+", label: t("about.yearsExperience") },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-4xl font-bold text-atv-orange mb-2">{value}</div>
                  <div className="text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
