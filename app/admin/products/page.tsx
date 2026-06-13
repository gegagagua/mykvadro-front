"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getAdminAtvs, createAtv, updateAtv, deleteAtv, getBrands, getCategories, getCities } from "@/services";

interface Atv {
  id: number;
  name: string;
  price: string;
  year: number;
  mileage: number;
  engine: string;
  transmission: string;
  fuel: string;
  isActive: boolean;
  brand?: { title: string };
  location?: { name: string };
}

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

export default function ProductsPage() {
  const [atvs, setAtvs] = useState<Atv[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAtv, setEditingAtv] = useState<Atv | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [brands, setBrands] = useState<{ id: number; title: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; title: string }[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);

  const fetchAtvs = (p = page) => {
    setLoading(true);
    getAdminAtvs(p)
      .then((res) => {
        setAtvs(res?.data?.data || []);
        setTotal(res?.data?.total || 0);
        setTotalPages(res?.data?.last_page || 1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAtvs();
    getBrands().then((res) => setBrands(res?.data || []));
    getCategories().then((res) => setCategories(res?.data || []));
    getCities().then((res) => setCities(res?.data?.data || []));
  }, []);

  useEffect(() => {
    fetchAtvs(page);
  }, [page]);

  const openCreate = () => {
    setEditingAtv(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (atv: Atv) => {
    setEditingAtv(atv);
    setForm({
      name: atv.name,
      price: atv.price,
      year: String(atv.year),
      mileage: String(atv.mileage),
      engine: atv.engine || "",
      transmission: atv.transmission || "",
      fuel: atv.fuel || "",
      clearance: (atv as any).clearance || "",
      description: (atv as any).description || "",
      brand_id: String((atv as any).brand_id || ""),
      location_id: String((atv as any).location_id || ""),
      category_id: String((atv as any).category_id || ""),
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      year: Number(form.year),
      mileage: Number(form.mileage),
      brand_id: form.brand_id ? Number(form.brand_id) : undefined,
      location_id: form.location_id ? Number(form.location_id) : undefined,
      category_id: form.category_id ? Number(form.category_id) : undefined,
    };
    try {
      if (editingAtv) {
        await updateAtv(editingAtv.id, payload);
      } else {
        await createAtv(payload);
      }
      setDialogOpen(false);
      fetchAtvs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("გააგრძელებთ წაშლას?")) return;
    try {
      await deleteAtv(id);
      fetchAtvs();
    } catch (err) {
      console.error(err);
    }
  };

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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">პროდუქტები</h1>
          <p className="text-muted-foreground mt-1">სულ: {total}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-atv-orange hover:bg-atv-orange-dark" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              პროდუქტის დამატება
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAtv ? "პროდუქტის რედაქტირება" : "ახალი პროდუქტი"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                {field("name", "სახელი")}
                {field("price", "ფასი")}
                {field("year", "წელი", "number")}
                {field("mileage", "გარბენი (კმ)", "number")}
                {field("engine", "ძრავი")}
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
                  placeholder="პროდუქტის აღწერა"
                  rows={3}
                  className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-atv-orange hover:bg-atv-orange-dark">
                  {editingAtv ? "განახლება" : "შექმნა"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  გაუქმება
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ყველა პროდუქტი</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">იტვირთება...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>სახელი</TableHead>
                    <TableHead>ფასი</TableHead>
                    <TableHead>წელი</TableHead>
                    <TableHead>ბრენდი</TableHead>
                    <TableHead>სტატუსი</TableHead>
                    <TableHead className="text-right">მოქმედებები</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {atvs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        პროდუქტები არ მოიძებნა
                      </TableCell>
                    </TableRow>
                  ) : (
                    atvs.map((atv) => (
                      <TableRow key={atv.id}>
                        <TableCell className="font-mono text-sm">{atv.id}</TableCell>
                        <TableCell className="font-medium max-w-48 truncate">{atv.name}</TableCell>
                        <TableCell>₾{Number(atv.price).toLocaleString()}</TableCell>
                        <TableCell>{atv.year}</TableCell>
                        <TableCell>{atv.brand?.title || "—"}</TableCell>
                        <TableCell>
                          <Badge variant={atv.isActive ? "default" : "secondary"}>
                            {atv.isActive ? "აქტიური" : "არააქტიური"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={() => openEdit(atv)}>
                              <Pencil className="h-4 w-4" />
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
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
