import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AtvGallery } from "@/components/AtvGallery";
import { ShareButtons } from "@/components/ShareButtons";
import { Calendar, Gauge, MapPin, Fuel, Settings2, Mountain, Phone, ChevronRight } from "lucide-react";
import { getAtvById, getRelatedAtvs } from "@/lib/atvs";

export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const abs = (p: string | null | undefined) => (!p ? `${SITE}/og-default.svg` : p.startsWith("http") ? p : `${SITE}${p}`);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const atv = await getAtvById(Number(id));
  if (!atv) return { title: "ვერ მოიძებნა — MyKvadro" };

  const price = `₾${Number(atv.price).toLocaleString()}`;
  const title = `${atv.name} (${atv.year}) — ${price} | MyKvadro`;
  const description = (atv.description || `${atv.name}, ${atv.year}. ფასი ${price}. ${atv.engine}, ${atv.transmission}.`).slice(0, 160);
  const image = abs(atv.first_image_url);
  const url = `${SITE}/atvs/${atv.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title, description, url, type: "website", siteName: "MyKvadro",
      images: [{ url: image, width: 800, height: 600, alt: atv.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

function Spec({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-atv-orange/10 text-atv-orange">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-semibold text-foreground">{value || "—"}</div>
      </div>
    </div>
  );
}

export default async function AtvDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const atv = await getAtvById(Number(id));
  if (!atv) notFound();

  const related = await getRelatedAtvs(atv);
  const price = `₾${Number(atv.price).toLocaleString()}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: atv.name,
    description: atv.description || atv.name,
    image: atv.active_images.map((i) => abs(i.url)),
    brand: atv.brand ? { "@type": "Brand", name: atv.brand.title } : undefined,
    category: atv.category?.title,
    offers: {
      "@type": "Offer",
      priceCurrency: "GEL",
      price: Number(atv.price),
      availability: "https://schema.org/InStock",
      url: `${SITE}/atvs/${atv.id}`,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-atv-orange">მთავარი</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/find-atvs" className="hover:text-atv-orange">კვადროციკლები</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium truncate">{atv.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AtvGallery images={atv.active_images} name={atv.name} />

          <div className="animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              {atv.isVip && <Badge className="bg-atv-orange text-white border-0">VIP</Badge>}
              {atv.brand?.title && <Badge variant="secondary">{atv.brand.title}</Badge>}
              {atv.category?.title && <Badge variant="outline">{atv.category.title}</Badge>}
            </div>
            <h1 className="text-3xl font-bold text-foreground">{atv.name}</h1>
            <div className="mt-1 flex items-center gap-3 text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{atv.year}</span>
              {atv.location?.name && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{atv.location.name}</span>}
            </div>

            <div className="mt-4 text-4xl font-extrabold text-atv-orange">{price}</div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Spec icon={Calendar} label="წელი" value={String(atv.year)} />
              <Spec icon={Gauge} label="გარბენი" value={`${atv.mileage.toLocaleString()} კმ`} />
              <Spec icon={Settings2} label="ძრავი" value={atv.engine} />
              <Spec icon={Settings2} label="ტრანსმისია" value={atv.transmission} />
              <Spec icon={Fuel} label="საწვავი" value={atv.fuel} />
              <Spec icon={Mountain} label="კლირენსი" value={atv.clearance} />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="flex-1 bg-atv-orange hover:bg-atv-orange-dark">
                <Phone className="h-4 w-4 mr-2" />დარეკვა გამყიდველთან
              </Button>
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <ShareButtons title={`${atv.name} — ${price}`} path={`/atvs/${atv.id}`} />
            </div>
          </div>
        </div>

        {/* Description */}
        {atv.description && (
          <section className="mt-10 max-w-3xl">
            <h2 className="text-xl font-bold text-foreground mb-3">აღწერა</h2>
            <p className="leading-relaxed text-muted-foreground whitespace-pre-line">{atv.description}</p>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-foreground mb-4">მსგავსი განცხადებები</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((r) => (
                <Link key={r.id} href={`/atvs/${r.id}`} className="group rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-[4/3] bg-atv-gray overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.first_image_url || "/seed/atvs/placeholder.svg"} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-atv-orange transition-colors">{r.name}</div>
                    <div className="text-atv-orange font-bold">₾{Number(r.price).toLocaleString()}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
