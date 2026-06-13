"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/store/auth";
import { getBrands, getCategories, getCities, createAtv, updateAtv, getAtv } from "@/services";
import { Suspense } from "react";

const emptyForm = {
  name: "",
  price: "",
  year: "",
  mileage: "",
  engine: "",
  transmission: "",
  fuel: "",
  clearance: "",
  description: "",
  brand_id: "",
  location_id: "",
  category_id: "",
};

function SellForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const { user, status } = useAuthStore();

  const [form, setForm] = useState(emptyForm);
  const [brands, setBrands] = useState<{ id: number; title: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; title: string }[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    getBrands().then((res) => setBrands(res?.data || []));
    getCategories().then((res) => setCategories(res?.data || []));
    getCities().then((res) => setCities(res?.data?.data || []));
  }, []);

  useEffect(() => {
    if (!editId) return;
    getAtv(editId)
      .then((res) => {
        const a = res?.data;
        if (!a) return;
        setForm({
          name: a.name || "",
          price: String(a.price || ""),
          year: String(a.year || ""),
          mileage: String(a.mileage || ""),
          engine: a.engine || "",
          transmission: a.transmission || "",
          fuel: a.fuel || "",
          clearance: a.clearance || "",
          description: a.description || "",
          brand_id: String(a.brand_id || ""),
          location_id: String(a.location_id || ""),
          category_id: String(a.category_id || ""),
        });
      });
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const payload = {
      ...form,
      year: Number(form.year),
      mileage: Number(form.mileage),
      brand_id: form.brand_id ? Number(form.brand_id) : undefined,
      location_id: form.location_id ? Number(form.location_id) : undefined,
      category_id: form.category_id ? Number(form.category_id) : undefined,
    };
    try {
      if (editId) {
        await updateAtv(Number(editId), payload);
      } else {
        await createAtv(payload);
      }
      router.push("/profile");
    } catch (err: any) {
      setError(err?.response?.data?.message || "შეცდომა. სცადეთ თავიდან.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "idle" || status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">იტვირთება...</p>
      </div>
    );
  }

  if (!user) return null;

  const field = (key: keyof typeof emptyForm, label: string, type = "text") => (
    <div key={key}>
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={label}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>{editId ? "განცხადების რედაქტირება" : "განცხადების დამატება"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {field("name", "სახელი / მოდელი")}
                {field("price", "ფასი (₾)")}
                {field("year", "წელი", "number")}
                {field("mileage", "გარბენი (კმ)", "number")}
                {field("engine", "ძრავი (მაგ: 300cc)")}
                {field("transmission", "გადაცემათა კოლოფი")}
                {field("fuel", "საწვავი")}
                {field("clearance", "კლირენსი")}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>ბრენდი</Label>
                  <Select value={form.brand_id} onValueChange={(v) => setForm({ ...form, brand_id: v })}>
                    <SelectTrigger><SelectValue placeholder="ბრენდი" /></SelectTrigger>
                    <SelectContent>
                      {brands.map((b) => <SelectItem key={b.id} value={String(b.id)}>{b.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>კატეგორია</Label>
                  <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                    <SelectTrigger><SelectValue placeholder="კატეგორია" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>ქალაქი</Label>
                  <Select value={form.location_id} onValueChange={(v) => setForm({ ...form, location_id: v })}>
                    <SelectTrigger><SelectValue placeholder="ქალაქი" /></SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">აღწერა</Label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="კვადროციკლის აღწერა"
                  rows={4}
                  className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 bg-atv-orange hover:bg-atv-orange-dark" disabled={loading}>
                  {loading ? "იგზავნება..." : editId ? "განახლება" : "გამოქვეყნება"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/profile")}>
                  გაუქმება
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default function SellMyAtvPage() {
  return (
    <Suspense>
      <SellForm />
    </Suspense>
  );
}
