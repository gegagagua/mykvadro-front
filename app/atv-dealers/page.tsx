"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Search, Store, Users2 } from "lucide-react";

interface Dealer {
  id: number;
  name: string;
  city: string;
  rating: number;
  reviews: number;
  phone: string;
  address: string;
  specialties: string[];
}

const dealers: Dealer[] = [
  {
    id: 1,
    name: "ATV ცენტრი თბილისი",
    city: "თბილისი",
    rating: 4.8,
    reviews: 214,
    phone: "+995 599 12 34 56",
    address: "ვაჟა-ფშაველას გამზ. 45, თბილისი",
    specialties: ["ახალი ATV", "სერვისი", "ნაწილები"],
  },
  {
    id: 2,
    name: "ბათუმი მოტო ჰაბი",
    city: "ბათუმი",
    rating: 4.6,
    reviews: 132,
    phone: "+995 577 88 99 00",
    address: "ჭავჭავაძის ქ. 12, ბათუმი",
    specialties: ["UTV", "მეორადი", "ლიზინგი"],
  },
  {
    id: 3,
    name: "ქუთაისი ოფ-როუდი",
    city: "ქუთაისი",
    rating: 4.9,
    reviews: 178,
    phone: "+995 591 44 55 66",
    address: "თამარ მეფის ქ. 8, ქუთაისი",
    specialties: ["ახალი ATV", "სპორტული", "აქსესუარები"],
  },
  {
    id: 4,
    name: "რუსთავი მოტორსი",
    city: "რუსთავი",
    rating: 4.4,
    reviews: 96,
    phone: "+995 555 21 43 65",
    address: "მესხიშვილის ქ. 30, რუსთავი",
    specialties: ["მეორადი", "სერვისი"],
  },
  {
    id: 5,
    name: "გორი ATV გალერი",
    city: "გორი",
    rating: 4.7,
    reviews: 71,
    phone: "+995 598 10 20 30",
    address: "სტალინის გამზ. 14, გორი",
    specialties: ["ახალი ATV", "გარანტია"],
  },
  {
    id: 6,
    name: "თბილისი პრემიუმ მოტო",
    city: "თბილისი",
    rating: 5.0,
    reviews: 305,
    phone: "+995 599 77 66 55",
    address: "აღმაშენებლის გამზ. 120, თბილისი",
    specialties: ["პრემიუმ", "ახალი ATV", "სერვისი", "ნაწილები"],
  },
  {
    id: 7,
    name: "ბათუმი კოსტ მოტორსი",
    city: "ბათუმი",
    rating: 4.5,
    reviews: 88,
    phone: "+995 577 33 22 11",
    address: "გორგილაძის ქ. 27, ბათუმი",
    specialties: ["UTV", "აქსესუარები", "ლიზინგი"],
  },
  {
    id: 8,
    name: "ქუთაისი მთის ტექნიკა",
    city: "ქუთაისი",
    rating: 4.3,
    reviews: 54,
    phone: "+995 591 99 88 77",
    address: "ნიკეას ქ. 5, ქუთაისი",
    specialties: ["მეორადი", "სერვისი", "ნაწილები"],
  },
];

const stats = [
  { value: "500+", label: "დარეგისტრირებული დილერი" },
  { value: "15+", label: "წლის გამოცდილება" },
  { value: "10+", label: "ქალაქი საქართველოში" },
  { value: "4.7", label: "საშუალო შეფასება" },
];

export default function ATVDealers() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dealers;
    return dealers.filter(
      (d) => d.name.toLowerCase().includes(q) || d.city.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-atv-orange/5 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-fade-in">
            <div className="flex items-center justify-center w-16 h-16 bg-atv-orange/10 rounded-2xl mx-auto mb-6">
              <Store className="h-8 w-8 text-atv-orange" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">{t("dealers.title")}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t("dealers.findNearYou")}
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ძებნა სახელით ან ქალაქით..."
                className="pl-10 h-12"
              />
            </div>
          </div>
        </section>

        {/* Stats band */}
        <section className="py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <div className="text-4xl font-bold text-atv-orange mb-2">{value}</div>
                  <div className="text-muted-foreground text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dealers grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">დილერების კატალოგი</h2>
              <span className="text-muted-foreground text-sm">
                ნაპოვნია {filtered.length} დილერი
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Users2 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  მოთხოვნაზე „{query}“ დილერი ვერ მოიძებნა.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((dealer, i) => (
                  <Card
                    key={dealer.id}
                    className="flex flex-col animate-slide-up"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <CardContent className="pt-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-foreground pr-2">{dealer.name}</h3>
                        <div className="flex items-center shrink-0 text-sm font-medium">
                          <Star className="h-4 w-4 text-atv-orange fill-atv-orange mr-1" />
                          {dealer.rating.toFixed(1)}
                          <span className="text-muted-foreground font-normal ml-1">
                            ({dealer.reviews})
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-atv-orange shrink-0" />
                          <span>
                            {dealer.city} · {dealer.address}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-atv-orange shrink-0" />
                          <span>{dealer.phone}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-5">
                        {dealer.specialties.map((s) => (
                          <Badge key={s} variant="secondary">
                            {s}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        asChild
                        className="w-full mt-auto bg-atv-orange hover:bg-atv-orange-dark"
                      >
                        <a href={`tel:${dealer.phone.replace(/\s/g, "")}`}>დაკავშირება</a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
