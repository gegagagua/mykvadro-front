import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShareButtons } from "@/components/ShareButtons";
import { Calendar, ChevronRight, ArrowRight, Newspaper } from "lucide-react";
import { getBlogById, getRelatedBlogs } from "@/lib/blogs";
import { SITE, abs } from "@/lib/seo";

export const dynamic = "force-dynamic";

function formatDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ka-GE", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

function excerpt(text: string, max = 160): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : clean.slice(0, max).trimEnd() + "…";
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlogById(Number(id));
  if (!blog) return { title: "ვერ მოიძებნა — MyKvadro" };

  const title = `${blog.title} | MyKvadro`;
  const description = excerpt(blog.description);
  const image = abs(blog.image);
  const url = `${SITE}/blog/${blog.id}`;

  return {
    title: blog.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "MyKvadro",
      locale: "ka_GE",
      images: [{ url: image, width: 1200, height: 630, alt: blog.title }],
      publishedTime: blog.created_at || undefined,
      modifiedTime: blog.updated_at || undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await getBlogById(Number(id));
  if (!blog) notFound();

  const related = await getRelatedBlogs(blog.id, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: blog.title,
    description: excerpt(blog.description),
    image: [abs(blog.image)],
    datePublished: blog.created_at || undefined,
    dateModified: blog.updated_at || blog.created_at || undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/blog/${blog.id}` },
    author: { "@type": "Organization", name: "MyKvadro" },
    publisher: {
      "@type": "Organization",
      name: "MyKvadro",
      logo: { "@type": "ImageObject", url: abs("/og-default.svg") },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-atv-orange">მთავარი</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/blog" className="hover:text-atv-orange">სიახლეები</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium truncate">{blog.title}</span>
        </nav>

        <article className="animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">{blog.title}</h1>
          {blog.created_at && (
            <div className="flex items-center text-sm text-muted-foreground mb-6">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(blog.created_at)}
            </div>
          )}

          {/* Cover image */}
          {blog.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-auto rounded-xl border border-border mb-8 object-cover"
            />
          ) : (
            <div className="w-full aspect-[3/2] rounded-xl bg-gradient-to-br from-atv-orange/20 to-atv-orange/5 flex items-center justify-center mb-8">
              <Newspaper className="h-12 w-12 text-atv-orange/40" />
            </div>
          )}

          {/* Body */}
          <div className="text-lg leading-relaxed text-foreground/90 whitespace-pre-line">
            {blog.description}
          </div>

          {/* Share */}
          <div className="mt-10 border-t border-border pt-6">
            <ShareButtons title={blog.title} path={`/blog/${blog.id}`} />
          </div>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-14 pt-8 border-t border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">სხვა სიახლეები</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`} className="group">
                  {post.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-36 object-cover rounded-lg mb-3 transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-36 rounded-lg bg-atv-orange/10 flex items-center justify-center mb-3">
                      <Newspaper className="h-8 w-8 text-atv-orange/40" />
                    </div>
                  )}
                  <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-atv-orange transition-colors">
                    {post.title}
                  </h3>
                  {post.created_at && (
                    <div className="text-xs text-muted-foreground mt-1">{formatDate(post.created_at)}</div>
                  )}
                  <span className="inline-flex items-center text-sm text-atv-orange mt-2">
                    ვრცლად
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </span>
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
