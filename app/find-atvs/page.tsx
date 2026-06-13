"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ATVFilters } from "@/components/ATVFilters";
import { ATVListingCard } from "@/components/ATVListingCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, List, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAtvs } from "@/services";

type Filters = Record<string, unknown>;

function buildQuery(opts: {
  page: number;
  sort: string;
  search?: string;
  brand?: string;
  filters: Filters;
}): string {
  const p = new URLSearchParams();
  p.set("page", String(opts.page));
  p.set("per_page", "12");
  p.set("sort", opts.sort);

  const f = opts.filters;
  const search = (f.model as string) || opts.search;
  if (search) p.set("search", search);
  const brand = (f.make as string) || opts.brand;
  if (brand) p.set("brand_id", brand);
  if (f.location) p.set("location_id", String(f.location));

  const price = f.priceRange as number[] | undefined;
  if (price) {
    if (price[0] > 0) p.set("min_price", String(price[0]));
    if (price[1] < 50000) p.set("max_price", String(price[1]));
  }
  const year = f.yearRange as number[] | undefined;
  if (year) {
    if (year[0] > 2000) p.set("min_year", String(year[0]));
    if (year[1] < 2026) p.set("max_year", String(year[1]));
  }
  return `?${p.toString()}`;
}

function FindATVsContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const urlBrand = searchParams.get("brand") || "";

  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({});
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = buildQuery({ page: currentPage, sort: sortBy, search: urlSearch, brand: urlBrand, filters });
    getAtvs(q)
      .then((res) => {
        setData(res?.data?.data || []);
        setTotalPages(res?.data?.last_page || 1);
        setTotal(res?.data?.total || 0);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [currentPage, sortBy, urlSearch, urlBrand, filters]);

  // reset to page 1 when the query inputs change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, urlSearch, urlBrand, filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {showFilters && (
            <div className="w-80 flex-shrink-0 hidden lg:block animate-slide-down">
              <ATVFilters onFiltersChange={setFilters} />
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <Filter className="h-4 w-4 mr-1" />
                  {t("filters.applyFilters")}
                </Button>
                <p className="text-sm text-muted-foreground">{total} შედეგი</p>
              </div>

              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t("findATVs.sortBy")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t("findATVs.sortNewest")}</SelectItem>
                    <SelectItem value="price-low">{t("findATVs.sortPrice")}</SelectItem>
                    <SelectItem value="price-high">{t("findATVs.sortPriceDesc")}</SelectItem>
                    <SelectItem value="year-new">{t("findATVs.sortYear")}</SelectItem>
                    <SelectItem value="year-old">{t("findATVs.sortYearOld")}</SelectItem>
                    <SelectItem value="mileage-low">{t("findATVs.sortMileage")}</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border border-border rounded-lg">
                  <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="rounded-r-none">
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="rounded-l-none">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-4"}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton h-80 rounded-xl" />
                ))}
              </div>
            ) : data.length > 0 ? (
              <>
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-4"}>
                  {data.map((listing, i) => (
                    <div key={listing.id as number} className="animate-slide-up" style={{ animationDelay: `${(i % 12) * 50}ms` }}>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <ATVListingCard listing={listing as any} />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                    <Button variant="outline" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                      {t("findATVs.previous")}
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button key={page} variant={page === currentPage ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)}>
                        {page}
                      </Button>
                    ))}
                    <Button variant="outline" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                      {t("findATVs.next")}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-foreground mb-2">{t("findATVs.noATVsFound")}</h3>
                <p className="text-muted-foreground">{t("findATVs.tryChanging")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function FindATVs() {
  return (
    <Suspense>
      <FindATVsContent />
    </Suspense>
  );
}
