"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2, Check, Facebook, Twitter, Send, MessageCircle } from "lucide-react";

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? window.location.origin + path
      : (process.env.NEXT_PUBLIC_SITE_URL || "") + path;

  const enc = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);

  const share = async (target: string) => {
    const links: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc}`,
      twitter: `https://twitter.com/intent/tweet?url=${enc}&text=${encTitle}`,
      whatsapp: `https://wa.me/?text=${encTitle}%20${enc}`,
      telegram: `https://t.me/share/url?url=${enc}&text=${encTitle}`,
    };
    if (target === "native" && typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
      return;
    }
    window.open(links[target], "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground mr-1">გაზიარება:</span>
      <Button variant="outline" size="sm" onClick={copy} className="gap-1.5">
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
        {copied ? "დაკოპირდა" : "ბმული"}
      </Button>
      <Button variant="outline" size="icon" onClick={() => share("facebook")} aria-label="Facebook" className="h-9 w-9">
        <Facebook className="h-4 w-4 text-[#1877f2]" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => share("twitter")} aria-label="X / Twitter" className="h-9 w-9">
        <Twitter className="h-4 w-4 text-sky-500" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => share("whatsapp")} aria-label="WhatsApp" className="h-9 w-9">
        <MessageCircle className="h-4 w-4 text-[#25d366]" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => share("telegram")} aria-label="Telegram" className="h-9 w-9">
        <Send className="h-4 w-4 text-[#229ed9]" />
      </Button>
    </div>
  );
}
