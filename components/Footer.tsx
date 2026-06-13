"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();

  const makes = [
    { name: "Polaris", count: "26,657" },
    { name: "Can-Am", count: "17,308" },
    { name: "Honda", count: "15,584" },
    { name: "Kawasaki", count: "13,741" },
  ];

  const models = [
    { name: "DEFENDER", count: "5,877" },
    { name: "PIONEER", count: "4,739" },
    { name: "CFORCE", count: "3,725" },
    { name: "UFORCE", count: "3,210" },
  ];

  const types = [
    { name: t("footer.sxs"), count: "55,301" },
    { name: t("footer.atv"), count: "41,154" },
    { name: t("footer.trailer"), count: "3,512" },
    { name: t("footer.golfCarts"), count: "2,349" },
  ];

  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">{t("footer.makes")}</h3>
            <ul className="space-y-2">
              {makes.map((make) => (
                <li key={make.name}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-atv-orange">
                    {make.name} ({make.count})
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">{t("footer.models")}</h3>
            <ul className="space-y-2">
              {models.map((model) => (
                <li key={model.name}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-atv-orange">
                    {model.name} ({model.count})
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">{t("footer.types")}</h3>
            <ul className="space-y-2">
              {types.map((type) => (
                <li key={type.name}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-atv-orange">
                    {type.name} ({type.count})
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};
