"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const ContentSections = () => {
  const { t } = useLanguage();

  return (
    <div className="py-16 space-y-0">
      <section className="bg-atv-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 bg-atv-orange rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🏍️</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">{t("sell.title")}</h2>
              <p className="text-lg text-muted-foreground mb-6">{t("sell.description")}</p>
              <Button className="bg-atv-orange hover:bg-atv-orange-dark text-white">
                {t("sell.button")}
              </Button>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="text-6xl text-center mb-4">🏁</div>
              <h3 className="text-xl font-semibold text-center text-foreground">{t("sell.today")}</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-atv-orange to-atv-orange-light text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-6xl">🛒</div>
            <div>
              <h2 className="text-3xl font-bold mb-4">{t("buyOnline.title")}</h2>
              <p className="text-lg mb-6 text-white/90">{t("buyOnline.description")}</p>
              <Button variant="secondary" className="bg-white text-atv-orange hover:bg-white/90">
                {t("buyOnline.button")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">{t("info.title")}</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p>{t("info.description")}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
