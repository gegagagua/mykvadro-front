import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { BrandLogos } from "@/components/BrandLogos";
import { FeaturedListings } from "@/components/FeaturedListings";
import { RecommendedATVs } from "@/components/RecommendedATVs";
import { ContentSections } from "@/components/ContentSections";
import { Footer } from "@/components/Footer";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "MyKvadro — კვადროციკლების ყიდვა-გაყიდვა",
  description:
    "MyKvadro — საქართველოს კვადროციკლების (ATV/UTV) მარკეტი. იყიდე და გაყიდე კვადროციკლი, გაეცანი სიახლეებსა და რჩევებს.",
  path: "/",
});

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturedListings />
      <RecommendedATVs />
      <ContentSections />
      <BrandLogos />
      <Footer />
    </div>
  );
}
