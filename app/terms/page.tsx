import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using ATV Trader, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Use License</h2>
              <p>Permission is granted to temporarily access the materials on ATV Trader for personal, non-commercial use only.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
              <p>When you create an account, you must provide accurate information and are responsible for all activities under your account.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Listing Guidelines</h2>
              <p>Users must provide accurate information about their vehicles. Misleading listings will result in immediate account suspension.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Prohibited Uses</h2>
              <p>You may not use our service for any unlawful purpose or to violate any regulations.</p>
            </section>
            <div className="text-sm text-muted-foreground mt-12 pt-8 border-t border-border">
              Last updated: January 2024
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
