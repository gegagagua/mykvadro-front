"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Gauge } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAtvs } from "@/services";

type Atv = {
  id: number;
  name: string;
  price: string;
  year: number;
  mileage: number;
  fuel: string;
  location?: { name: string } | null;
  brand?: { title: string } | null;
  active_images?: { url: string }[];
};

export const RecommendedATVs = () => {
  const { t } = useLanguage();
  const [atvs, setAtvs] = useState<Atv[]>([]);

  useEffect(() => {
    getAtvs("?per_page=4&sort=price-low")
      .then((res) => setAtvs(res?.data?.data || []))
      .catch(() => setAtvs([]));
  }, []);

  if (atvs.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground">{t("recommended.title")}</h2>
          <Button variant="outline" className="border-atv-orange text-atv-orange hover:bg-atv-orange hover:text-white" asChild>
            <Link href="/find-atvs">{t("recommended.viewAll")}</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {atvs.map((atv, i) => (
            <Link key={atv.id} href={`/atvs/${atv.id}`}>
              <Card
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white overflow-hidden animate-slide-up h-full"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden bg-atv-gray">
                    {atv.active_images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={atv.active_images[0].url}
                        alt={atv.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">🏍️</div>
                    )}
                    <Badge className="absolute top-2 right-2 bg-green-100 text-green-800 border border-green-200">
                      {atv.year}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-2 group-hover:text-atv-orange transition-colors">
                      {atv.name}
                    </h3>
                    <div className="text-2xl font-bold text-atv-orange mb-2">₾{Number(atv.price).toLocaleString()}</div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" />{atv.mileage.toLocaleString()} კმ</span>
                      {atv.location?.name && (
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{atv.location.name}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {atv.brand?.title && <Badge variant="secondary" className="text-xs">{atv.brand.title}</Badge>}
                      {atv.fuel && <Badge variant="secondary" className="text-xs">{atv.fuel}</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
