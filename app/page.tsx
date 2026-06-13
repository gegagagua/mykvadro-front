import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { BrandLogos } from "@/components/BrandLogos";
import { FeaturedListings } from "@/components/FeaturedListings";
import { RecommendedATVs } from "@/components/RecommendedATVs";
import { ContentSections } from "@/components/ContentSections";
import { Footer } from "@/components/Footer";

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
