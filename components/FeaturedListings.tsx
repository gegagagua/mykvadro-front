"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAtvs } from "@/services";

type Listing = {
  id: number;
  name: string;
  price: string;
  year: number;
  mileage: number;
  transmission: string;
  fuel: string;
  isVip: boolean;
  location?: { name: string } | null;
  brand?: { title: string } | null;
  active_images?: { url: string }[];
};

export const FeaturedListings = () => {
  const { t } = useLanguage();
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    getAtvs("?per_page=4&sort=newest")
      .then((res) => setListings(res?.data?.data || []))
      .catch(() => setListings([]));
  }, []);

  if (listings.length === 0) return null;

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground">{t("featured.title")}</h2>
          <Button variant="outline" className="border-atv-orange text-atv-orange hover:bg-atv-orange hover:text-white" asChild>
            <Link href="/find-atvs">{t("featured.viewAll")}</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing, i) => (
            <Link key={listing.id} href={`/atvs/${listing.id}`}>
              <Card
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden animate-slide-up h-full"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden bg-atv-gray">
                    {listing.active_images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={listing.active_images[0].url}
                        alt={listing.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">🏍️</div>
                    )}
                    {listing.isVip && (
                      <Badge className="absolute top-2 left-2 bg-atv-orange text-white border-0">VIP</Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-2 group-hover:text-atv-orange transition-colors">
                      {listing.name}
                    </h3>
                    <div className="text-2xl font-bold text-atv-orange mb-2">
                      ₾{Number(listing.price).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{listing.year}</span>
                      {listing.location?.name && (
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{listing.location.name}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {listing.brand?.title && <Badge variant="secondary" className="text-xs">{listing.brand.title}</Badge>}
                      {listing.transmission && <Badge variant="secondary" className="text-xs">{listing.transmission}</Badge>}
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
