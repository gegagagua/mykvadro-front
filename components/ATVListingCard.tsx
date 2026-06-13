"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Calendar, Gauge, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { dateToLocale } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface ATVListing {
  id: number;
  active_images: { url: string }[];
  name: string;
  price: string;
  year: number;
  clearance: string;
  mileage: number;
  transmission: string;
  fuel: string;
  isActive: boolean;
  isVip: boolean;
  engine: string;
  description: string;
  created_at: string;
  updated_at: string;
  location_id: number | null;
  location?: { name: string };
}

export const ATVListingCard = ({ listing }: { listing: ATVListing }) => {
  const { t } = useLanguage();
  const [isFavorited, setIsFavorited] = useState(false);

  const formatPrice = (price: number) => `₾${price.toLocaleString()}`;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
      <div className="relative">
        <Link href={`/atvs/${listing.id}`} className="block">
          {listing?.active_images?.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.active_images[0].url}
              alt={listing.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-48 bg-atv-gray flex items-center justify-center text-5xl">🏍️</div>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 h-8 w-8 rounded-full ${
            isFavorited
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white/80 text-gray-600 hover:bg-white"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
        </Button>
        <Badge
          className="absolute top-2 left-2 border bg-green-100 text-green-800 border-green-200"
          variant="outline"
        >
          {listing.year}
        </Badge>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/atvs/${listing.id}`}>
            <h4 className="font-semibold text-md text-foreground group-hover:text-primary transition-colors">
              {listing.name}
            </h4>
          </Link>
          <div className="text-right">
            <div className="text-xl font-bold text-primary">
              {formatPrice(Number(listing.price))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {listing.year} {t("listing.year")}
            </span>
          </div>
          <div className="flex items-center gap-1" style={{ justifyContent: "end" }}>
            <Gauge className="h-4 w-4" />
            <span>
              {listing.mileage.toLocaleString()} {t("listing.mileage")}
            </span>
          </div>
          {listing?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{listing.location.name}</span>
            </div>
          )}
          <div className="flex items-center gap-1" style={{ justifyContent: "end" }}>
            <span className="font-medium">{listing.engine?.replace("Engine", "")}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="secondary" className="text-xs">
            {listing.transmission}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span className="text-blue-600 font-medium">{listing.fuel}</span>
          <span>{dateToLocale(listing.created_at)}</span>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            <Phone className="h-4 w-4 mr-1" />
            {t("listing.call")}
          </Button>
        </div>
      </div>
    </Card>
  );
};
