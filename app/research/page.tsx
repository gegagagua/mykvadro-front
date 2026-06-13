"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Compass,
  GitCompareArrows,
  Wrench,
  ShieldCheck,
  FileText,
  Tag,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Guide {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Faq {
  question: string;
  answer: string;
}

const guides: Guide[] = [
  {
    icon: Compass,
    title: "როგორ ავირჩიოთ პირველი ATV",
    description:
      "ძრავის მოცულობა, წონა და გამოცდილების დონე — ყველაფერი, რაც უნდა იცოდეთ პირველი კვადროციკლის შესაძენად.",
  },
  {
    icon: GitCompareArrows,
    title: "ATV vs UTV",
    description:
      "რა განსხვავებაა კვადროციკლსა და UTV-ს შორის და რომელია უკეთესი თქვენი საჭიროებებისთვის.",
  },
  {
    icon: Wrench,
    title: "მოვლა და სერვისი",
    description:
      "რეგულარული ტექმომსახურების გრაფიკი, ზეთის შეცვლა და მარტივი რჩევები ხანგრძლივი მუშაობისთვის.",
  },
  {
    icon: ShieldCheck,
    title: "უსაფრთხოება",
    description:
      "დამცავი აღჭურვილობა, სწორი მართვის ტექნიკა და უსაფრთხო გადაადგილების წესები ნებისმიერ რელიეფზე.",
  },
  {
    icon: FileText,
    title: "გარანტია და დაზღვევა",
    description:
      "როგორ მუშაობს ქარხნული გარანტია, რა ფარავს დაზღვევა და როგორ დაიცვათ თქვენი ინვესტიცია.",
  },
  {
    icon: Tag,
    title: "ფასების გზამკვლევი",
    description:
      "ახალი და მეორადი ATV-ების საბაზრო ფასები, რა გავლენას ახდენს ღირებულებაზე და როგორ ივაჭროთ.",
  },
];

const faqs: Faq[] = [
  {
    question: "რა ძრავის მოცულობა ჯობია დამწყებისთვის?",
    answer:
      "დამწყებთათვის რეკომენდებულია 250-450cc მოცულობის ძრავი — ის უზრუნველყოფს საკმარის სიმძლავრეს გართობისთვის, თუმცა რჩება მართვადი და უსაფრთხო. უფრო მძლავრი 700cc+ მოდელები გამოცდილ მძღოლებს უხდებათ.",
  },
  {
    question: "რა განსხვავებაა ATV-სა და UTV-ს შორის?",
    answer:
      "ATV (კვადროციკლი) ერთი ადამიანისთვისაა განკუთვნილი და სამართავად სახელურს იყენებს, ხოლო UTV უფრო დიდია, აქვს საჭე, სავარძლები რამდენიმე მგზავრისთვის და ხშირად ბარგის გადასაზიდი სივრცე.",
  },
  {
    question: "რამდენად ხშირად სჭირდება კვადროციკლს ტექმომსახურება?",
    answer:
      "ზეთის შეცვლა რეკომენდებულია ყოველ 100-150 საათში ან წელიწადში ერთხელ. ჰაერის ფილტრი, ჯაჭვი/ბარბაცა და სამუხრუჭე სითხე უნდა შემოწმდეს ყოველი გასვლის წინ, განსაკუთრებით ტალახიან რელიეფზე მართვის შემდეგ.",
  },
  {
    question: "სავალდებულოა თუ არა ჩაფხუტი და დამცავი აღჭურვილობა?",
    answer:
      "დიახ, ჩაფხუტი აუცილებელია ნებისმიერ შემთხვევაში. ასევე რეკომენდებულია დამცავი სათვალე, ხელთათმანები, მაღალყელიანი ფეხსაცმელი და ზურგის დამცავი — ეს მნიშვნელოვნად ამცირებს ტრავმის რისკს.",
  },
  {
    question: "ახალი თუ მეორადი ATV ვიყიდო?",
    answer:
      "ახალი მოდელი ქარხნულ გარანტიასა და უახლეს ტექნოლოგიებს გთავაზობთ, თუმცა ძვირია. ხარისხიანი მეორადი კარგი არჩევანია შეზღუდული ბიუჯეტისთვის — მთავარია, შეამოწმოთ სერვისის ისტორია და ტექნიკური მდგომარეობა.",
  },
  {
    question: "შემიძლია თუ არა კვადროციკლის გზებზე მართვა?",
    answer:
      "ეს დამოკიდებულია ადგილობრივ კანონმდებლობასა და კვადროციკლის ტიპზე. ბევრი ATV განკუთვნილია მხოლოდ ბილიკებსა და კერძო ტერიტორიებზე გადასაადგილებლად. ყოველთვის გადაამოწმეთ ადგილობრივი რეგულაციები.",
  },
];

export default function Research() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-atv-orange/5 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-fade-in">
            <div className="flex items-center justify-center w-16 h-16 bg-atv-orange/10 rounded-2xl mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-atv-orange" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">{t("research.title")}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("research.heading")} — გზამკვლევები, რჩევები და პასუხები ყველაზე ხშირ კითხვებზე, რომ
              თქვენი არჩევანი იყოს ინფორმირებული.
            </p>
          </div>
        </section>

        {/* Buying guides */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12 animate-slide-up">
              ყიდვის გზამკვლევები
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {guides.map((guide, i) => {
                const Icon = guide.icon;
                return (
                  <Card
                    key={guide.title}
                    className="group hover:shadow-lg transition-shadow animate-scale-in"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-center w-14 h-14 bg-atv-orange/10 rounded-xl mb-4 group-hover:bg-atv-orange/20 transition-colors">
                        <Icon className="h-7 w-7 text-atv-orange" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{guide.title}</h3>
                      <p className="text-muted-foreground">{guide.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              ხშირად დასმული კითხვები
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-atv-orange/5 rounded-2xl p-8 md:p-12 text-center animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground mb-2">მზად ხართ არჩევანისთვის?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                დაათვალიერეთ ხელმისაწვდომი კვადროციკლები და იპოვეთ თქვენთვის იდეალური მოდელი.
              </p>
              <Button asChild className="bg-atv-orange hover:bg-atv-orange-dark">
                <Link href="/find-atvs">
                  კვადროების ნახვა
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
