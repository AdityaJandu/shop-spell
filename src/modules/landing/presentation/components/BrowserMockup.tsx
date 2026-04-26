import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Lock, CheckCircle2, Send, Search, ShoppingBag } from "lucide-react";

export function BrowserMockup() {
  return (
    <section className="w-full mt-32 px-4 md:px-0">
      <Card className="w-full bg-card rounded-[32px] shadow-2xl border-border/50 overflow-hidden flex flex-col h-[750px]">
        {/* Browser Header */}
        <div className="h-12 bg-muted/50 border-b border-border/30 flex items-center px-6 gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="mx-auto bg-background rounded-full px-8 py-1.5 flex items-center gap-2 border border-border/50 text-[11px] text-muted-foreground font-mono">
            <Lock className="w-3 h-3" />
            <span className="opacity-70">https://</span>shopspell.ai/builder
          </div>
        </div>

        {/* Split Screen Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-background">
          {/* Left: Chat UI */}
          <div className="w-full md:w-[380px] border-r border-border/30 bg-muted/10 flex flex-col p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary shadow-xl shadow-primary-container/20">
                <Sparkles className="w-7 h-7 fill-on-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground leading-tight text-lg">ShopSpell AI</h4>
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold opacity-70">Design Partner</p>
              </div>
            </div>

            <ScrollArea className="flex-1 -mr-2 pr-4">
              <div className="flex flex-col gap-6">
                {/* User Message */}
                <div className="bg-card p-5 rounded-2xl rounded-tr-sm shadow-sm self-end max-w-[90%] border border-border/30">
                  <p className="text-[15px] text-foreground leading-relaxed">
                    I need a clean, minimalist store for my artisan candles. Mostly warm tones and lots of whitespace.
                  </p>
                </div>

                {/* AI Response */}
                <div className="bg-muted p-5 rounded-2xl rounded-tl-sm shadow-sm self-start max-w-[95%]">
                  <p className="text-[15px] text-foreground mb-4 leading-relaxed">
                    I&apos;ve generated a warm, minimalist layout utilizing our &apos;Editorial&apos; theme block. I added a gallery for your candle collections.
                  </p>
                  <div className="bg-background/90 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 border border-border/40 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Applying Theme</span>
                      <span className="text-[11px] font-bold text-foreground">Warm Editorial palette active</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="mt-8 relative">
              <Input
                className="w-full bg-background rounded-2xl py-8 pl-6 pr-14 shadow-sm border-border/60 focus-visible:ring-primary-container transition-all text-base"
                placeholder="Tweak the design..."
              />
              <Button size="icon" variant="ghost" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-container hover:text-primary-container/80 hover:bg-transparent">
                <Send className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Right: Preview UI */}
          <div className="flex-1 bg-muted/1 relative overflow-hidden flex flex-col px-6 md:px-10">
            {/* Simulated Storefront Container */}
            <div className="flex-1 flex items-start justify-center w-full overflow-y-auto scrollbar-hide">
              <Card className="w-full max-w-2xl bg-card/5 rounded-t-2xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col border-border/30 transition-all duration-500 min-h-[450px] my-4">
                {/* Storefront Nav */}
                <div className="h-16 flex items-center justify-between px-8">
                  <div className="text-xl font-black text-foreground tracking-tighter uppercase">
                    Lumina
                  </div>
                  <div className="flex gap-6">
                    <Search className="w-5 h-5 text-foreground cursor-pointer opacity-40 hover:opacity-100 transition-opacity" />
                    <ShoppingBag className="w-5 h-5 text-foreground cursor-pointer opacity-40 hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                <div className="w-full relative h-[350px] overflow-hidden">
                  <Image
                    alt="artisanal handmade candle burning on a clean marble surface"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeEaDLRDc3rGTvLUu3TjR8gewnWPla_C-JH5oty1IkvKdr5qtoPwoAn1U8HcV5645xHXQVhqE9Kb9pKPpr9UKhDpRGrUZtSwF1Y-CGwaJxxFkwroBb51ZlvXq9IoHCli5I53tR-RpRdrsAmSYMR2dPNH3675EB_V0MehmDgR9Ki8XavVe3x-G11UHSurR3dLe53uYDykclQZUrqj_Bf73CANL3oPgUaul1uTjGGIeFk8l92CgzZLh7n0bbcI5Oo9AeVm-VyVgTm2M"
                    width={1200}
                    height={800}
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent opacity-60"></div>
                </div>

                <div className="px-8 md:px-12 flex flex-col items-center text-center">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight leading-[1.1]">
                    Hand-poured ambiance.
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-[450px] leading-relaxed opacity-80">
                    Crafted with organic essential oils and sustainable soy wax for a cleaner, longer-lasting burn.
                  </p>
                </div>
              </Card>
            </div>

            {/* Floating status indicator */}
            <Badge variant="outline" className="absolute top-10 right-10 bg-card/95 backdrop-blur-xl rounded-full px-10 py-3 shadow-2xl flex items-center gap-3 border-border/50 group z-10">
              <span className="w-3 h-3 rounded-full bg-secondary animate-pulse shadow-[0_0_12px_rgba(var(--secondary),0.6)]"></span>
              <span className="text-[12px] uppercase tracking-[0.25em] font-black text-foreground">
                LIVE PREVIEW
              </span>
            </Badge>
          </div>
        </div>
      </Card>
    </section>
  );
}
