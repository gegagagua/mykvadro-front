"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getBlogs } from "@/services";
import { Calendar, ArrowRight, Newspaper, Mail, CheckCircle2 } from "lucide-react";

interface Blog {
  id: number;
  title: string;
  description: string;
  image: string | null;
  created_at: string | null;
}

function formatDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ka-GE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function excerpt(text: string, max = 140): string {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

export default function Blog() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let active = true;
    getBlogs()
      .then((res: { data: Blog[] }) => {
        if (active) setPosts(res?.data ?? []);
      })
      .catch(() => {
        if (active) setPosts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-atv-orange/5 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-fade-in">
            <div className="flex items-center justify-center w-16 h-16 bg-atv-orange/10 rounded-2xl mx-auto mb-6">
              <Newspaper className="h-8 w-8 text-atv-orange" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">{t("blog.title")}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("blog.heading")}</p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="skeleton h-48 w-full" />
                    <CardContent className="pt-6 space-y-3">
                      <div className="skeleton h-4 w-24 rounded" />
                      <div className="skeleton h-6 w-3/4 rounded" />
                      <div className="skeleton h-4 w-full rounded" />
                      <div className="skeleton h-4 w-5/6 rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Newspaper className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground">{t("blog.description")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, i) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden flex flex-col group animate-slide-up"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    {post.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-48 w-full bg-gradient-to-br from-atv-orange/20 to-atv-orange/5 flex items-center justify-center">
                        <Newspaper className="h-10 w-10 text-atv-orange/40" />
                      </div>
                    )}
                    <CardContent className="pt-6 flex flex-col flex-1">
                      {post.created_at && (
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(post.created_at)}
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-atv-orange transition-colors">
                        <Link href={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>
                      <p className="text-muted-foreground mb-4 flex-1">{excerpt(post.description)}</p>
                      <Link
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center font-medium text-atv-orange hover:text-atv-orange-dark transition-colors"
                      >
                        ვრცლად
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-atv-orange/5 rounded-2xl p-8 md:p-12 animate-scale-in">
              <div className="max-w-2xl mx-auto text-center">
                <div className="flex items-center justify-center w-14 h-14 bg-atv-orange/10 rounded-xl mx-auto mb-4">
                  <Mail className="h-7 w-7 text-atv-orange" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">გამოიწერეთ სიახლეები</h2>
                <p className="text-muted-foreground mb-6">
                  მიიღეთ უახლესი სტატიები, რჩევები და შემოთავაზებები კვადროციკლების სამყაროდან პირდაპირ თქვენს ფოსტაზე.
                </p>
                {subscribed ? (
                  <div className="flex items-center justify-center text-atv-orange font-medium">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    გმადლობთ! გამოწერა წარმატებით დასრულდა.
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="თქვენი ელ. ფოსტა"
                      required
                      className="flex-1"
                    />
                    <Button type="submit" className="bg-atv-orange hover:bg-atv-orange-dark">
                      გამოწერა
                    </Button>
                  </form>
                )}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  {["სიახლეები", "რჩევები", "მიმოხილვები", "შემოთავაზებები"].map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
