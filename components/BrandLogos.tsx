"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBrands } from "@/services";

type Brand = { id: number; title: string; image?: string | null };

export const BrandLogos = () => {
  const { t } = useLanguage();
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    getBrands()
      .then((res) => setBrands((res?.data || []).slice(0, 12)))
      .catch(() => setBrands([]));
  }, []);

  if (brands.length === 0) return null;

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground">{t("brands.title")}</h2>
          <div className="flex space-x-2">
            <Badge variant="secondary" className="bg-foreground text-background">{t("brands.makes")}</Badge>
            <Badge variant="outline">{t("brands.types")}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {brands.map((brand, i) => (
            <Link
              key={brand.id}
              href={`/find-atvs?brand=${brand.id}`}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="h-14 flex items-center justify-center mb-3">
                {brand.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={brand.image} alt={brand.title} className="max-h-14 max-w-[90%] object-contain" />
                ) : (
                  <div className="text-3xl">🏷️</div>
                )}
              </div>
              <h3 className="font-semibold text-foreground text-sm">{brand.title}</h3>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/find-atvs" className="text-atv-orange hover:text-atv-orange-dark font-medium">
            {t("brands.seeAll")}
          </Link>
        </div>
      </div>
    </section>
  );
};
