"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Package, ShoppingCart } from "lucide-react";
import { getBrands, getCategories, getAdminAtvs } from "@/services";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ brands: 0, categories: 0, products: 0 });

  useEffect(() => {
    Promise.all([getBrands(), getCategories(), getAdminAtvs()]).then(
      ([brands, categories, atvs]) => {
        setStats({
          brands: brands?.data?.length || 0,
          categories: categories?.data?.length || 0,
          products: atvs?.data?.total || 0,
        });
      }
    );
  }, []);

  const cards = [
    { title: "კატეგორიები", value: stats.categories, icon: Tag, href: "/admin/categories" },
    { title: "ბრენდები", value: stats.brands, icon: Package, href: "/admin/brands" },
    { title: "პროდუქტები", value: stats.products, icon: ShoppingCart, href: "/admin/products" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(({ title, value, icon: Icon }) => (
          <Card key={title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <Icon className="h-5 w-5 text-atv-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
