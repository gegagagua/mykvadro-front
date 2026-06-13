"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { getMyAtvs, deleteAtv, updateProfile } from "@/services";

interface Atv {
  id: number;
  name: string;
  price: string;
  year: number;
  isActive: boolean;
  brand?: { title: string };
  first_image_url?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, status, setUser } = useAuthStore();

  const [atvs, setAtvs] = useState<Atv[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [atvLoading, setAtvLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (user) setForm({ name: user.name, phone: user.phone || "" });
  }, [user]);

  const fetchAtvs = (p = page) => {
    if (!user) return;
    setAtvLoading(true);
    getMyAtvs(user.id, p)
      .then((res) => {
        setAtvs(res?.data?.data || []);
        setTotal(res?.data?.total || 0);
        setTotalPages(res?.data?.last_page || 1);
      })
      .finally(() => setAtvLoading(false));
  };

  useEffect(() => {
    if (user) fetchAtvs();
  }, [user]);

  useEffect(() => {
    if (user) fetchAtvs(page);
  }, [page]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await updateProfile({ name: form.name, phone: form.phone });
      if (res?.data?.user) setUser(res.data.user);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("წაშლა დარწმუნებული ხართ?")) return;
    await deleteAtv(id);
    fetchAtvs();
  };

  if (status === "idle" || status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">იტვირთება...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <Tabs defaultValue="listings">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">ჩემი გვერდი</h1>
            <TabsList>
              <TabsTrigger value="listings">განცხადებები ({total})</TabsTrigger>
              <TabsTrigger value="profile">პროფილი</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="listings">
            <div className="flex justify-end mb-4">
              <Button className="bg-atv-orange hover:bg-atv-orange-dark" asChild>
                <Link href="/sell-my-atv">
                  <Plus className="h-4 w-4 mr-2" />
                  განცხადების დამატება
                </Link>
              </Button>
            </div>

            {atvLoading ? (
              <p className="text-center text-muted-foreground py-12">იტვირთება...</p>
            ) : atvs.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground mb-4">განცხადებები არ გაქვთ</p>
                  <Button className="bg-atv-orange hover:bg-atv-orange-dark" asChild>
                    <Link href="/sell-my-atv">პირველი განცხადების დამატება</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {atvs.map((atv) => (
                  <Card key={atv.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="flex items-center gap-4 py-4">
                      {atv.first_image_url ? (
                        <img src={atv.first_image_url} alt={atv.name} className="w-20 h-16 object-cover rounded-md flex-shrink-0" />
                      ) : (
                        <div className="w-20 h-16 bg-muted rounded-md flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{atv.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {atv.brand?.title && `${atv.brand.title} · `}{atv.year} · ₾{Number(atv.price).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={atv.isActive ? "default" : "secondary"} className="flex-shrink-0">
                        {atv.isActive ? "აქტიური" : "არააქტიური"}
                      </Badge>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/sell-my-atv?edit=${atv.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(atv.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <Button variant="outline" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
                      წინა
                    </Button>
                    <span className="flex items-center px-4 text-sm text-muted-foreground">
                      {page} / {totalPages}
                    </span>
                    <Button variant="outline" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
                      შემდეგი
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>პირადი მონაცემები</CardTitle>
                {!editing ? (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    რედაქტირება
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-atv-orange hover:bg-atv-orange-dark" onClick={handleSaveProfile} disabled={saving}>
                      <Check className="h-4 w-4 mr-1" />
                      შენახვა
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setEditing(false); setForm({ name: user.name, phone: user.phone || "" }); }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>სახელი</Label>
                  {editing ? (
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  ) : (
                    <p className="mt-1 text-foreground">{user.name}</p>
                  )}
                </div>
                <div>
                  <Label>ელ-ფოსტა</Label>
                  <p className="mt-1 text-foreground">{user.email}</p>
                </div>
                <div>
                  <Label>ტელეფონი</Label>
                  {editing ? (
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+995 5XX XXX XXX" />
                  ) : (
                    <p className="mt-1 text-foreground">{user.phone || "—"}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
