"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { X, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBrands, getCities } from "@/services";

interface ATVFiltersProps {
  onFiltersChange: (filters: Record<string, unknown>) => void;
}

export const ATVFilters = ({ onFiltersChange }: ATVFiltersProps) => {
  const { t } = useLanguage();
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [yearRange, setYearRange] = useState([2000, 2026]);
  const [mileageRange, setMileageRange] = useState([0, 30000]);
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    condition: "",
    engineSize: "",
    location: "",
    category: "",
  });
  const [brands, setBrands] = useState<{ id: number; title: string }[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    getBrands().then((res) => setBrands(res.data || []));
    getCities().then((res) => setCities(res.data?.data || []));
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange({ ...newFilters, priceRange, yearRange, mileageRange });
  };

  const clearFilters = () => {
    setFilters({ make: "", model: "", condition: "", engineSize: "", location: "", category: "" });
    setPriceRange([0, 50000]);
    setYearRange([2000, 2026]);
    setMileageRange([0, 30000]);
    onFiltersChange({});
  };

  const hasActiveFilters =
    Object.values(filters).some((v) => v !== "") ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 50000 ||
    yearRange[0] !== 2000 ||
    yearRange[1] !== 2026 ||
    mileageRange[0] !== 0 ||
    mileageRange[1] !== 30000;

  return (
    <Card className="p-6 sticky top-4">
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground hover:text-destructive mb-4"
        >
          <X className="h-4 w-4 mr-1" />
          {t("filters.clearFilters")}
        </Button>
      )}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">{t("filters.applyFilters")}</h3>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>{t("filters.manufacturer")}</Label>
          <Select value={filters.make} onValueChange={(v) => handleFilterChange("make", v)}>
            <SelectTrigger>
              <SelectValue placeholder={t("filters.selectManufacturer")} />
            </SelectTrigger>
            <SelectContent>
              {brands.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("filters.model")}</Label>
          <Input
            placeholder={t("filters.modelName")}
            value={filters.model}
            onChange={(e) => handleFilterChange("model", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>{t("filters.priceGEL")}</Label>
          <div className="px-3">
            <Slider
              value={priceRange}
              onValueChange={(v) => {
                setPriceRange(v);
                onFiltersChange({ ...filters, priceRange: v, yearRange, mileageRange });
              }}
              max={50000}
              min={0}
              step={200}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₾{priceRange[0].toLocaleString()}</span>
            <span>₾{priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("filters.yearOfManufacture")}</Label>
          <div className="px-3">
            <Slider
              value={yearRange}
              onValueChange={(v) => {
                setYearRange(v);
                onFiltersChange({ ...filters, priceRange, yearRange: v, mileageRange });
              }}
              max={2024}
              min={2000}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{yearRange[0]}</span>
            <span>{yearRange[1]}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("filters.mileageKm")}</Label>
          <div className="px-3">
            <Slider
              value={mileageRange}
              onValueChange={(v) => {
                setMileageRange(v);
                onFiltersChange({ ...filters, priceRange, yearRange, mileageRange: v });
              }}
              max={10000}
              min={0}
              step={100}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{mileageRange[0].toLocaleString()} km</span>
            <span>{mileageRange[1].toLocaleString()} km</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("filters.condition")}</Label>
          <Select value={filters.condition} onValueChange={(v) => handleFilterChange("condition", v)}>
            <SelectTrigger>
              <SelectValue placeholder={t("filters.selectCondition")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">{t("filters.new")}</SelectItem>
              <SelectItem value="excellent">{t("filters.excellent")}</SelectItem>
              <SelectItem value="good">{t("filters.good")}</SelectItem>
              <SelectItem value="fair">{t("filters.fair")}</SelectItem>
              <SelectItem value="needs-work">{t("filters.needsRepair")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("filters.engineSize")}</Label>
          <Select value={filters.engineSize} onValueChange={(v) => handleFilterChange("engineSize", v)}>
            <SelectTrigger>
              <SelectValue placeholder={t("filters.selectEngineSize")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50-125">50-125cc</SelectItem>
              <SelectItem value="126-250">126-250cc</SelectItem>
              <SelectItem value="251-400">251-400cc</SelectItem>
              <SelectItem value="401-600">401-600cc</SelectItem>
              <SelectItem value="601-800">601-800cc</SelectItem>
              <SelectItem value="800+">800cc+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("filters.location")}</Label>
          <Select value={filters.location} onValueChange={(v) => handleFilterChange("location", v)}>
            <SelectTrigger>
              <SelectValue placeholder={t("filters.selectCity")} />
            </SelectTrigger>
            <SelectContent>
              {cities.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("filters.category")}</Label>
          <Select value={filters.category} onValueChange={(v) => handleFilterChange("category", v)}>
            <SelectTrigger>
              <SelectValue placeholder={t("filters.selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sport">{t("filters.sport")}</SelectItem>
              <SelectItem value="utility">{t("filters.utility")}</SelectItem>
              <SelectItem value="youth">{t("filters.youth")}</SelectItem>
              <SelectItem value="touring">{t("filters.touring")}</SelectItem>
              <SelectItem value="racing">{t("filters.racing")}</SelectItem>
              <SelectItem value="recreational">{t("filters.recreational")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
