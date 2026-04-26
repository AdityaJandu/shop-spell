"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPING_PHRASES = [
  "I sell handmade candles with organic essential oils...",
  "A minimalist fashion brand for sustainable urban wear...",
  "Artisan coffee beans roasted in small batches...",
  "Custom pet portraits painted with watercolors...",
];

export function Hero() {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const currentPhrase = TYPING_PHRASES[phraseIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        setDisplayText(currentPhrase.substring(0, displayText.length + 1));
        setTypingSpeed(100);

        if (displayText === currentPhrase) {
          setIsDeleting(true);
          setTypingSpeed(2000); // Pause at end
        }
      } else {
        setDisplayText(currentPhrase.substring(0, displayText.length - 1));
        setTypingSpeed(50);

        if (displayText === "") {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
          setTypingSpeed(500);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex, typingSpeed]);

  return (
    <section className="text-center max-w-5xl mx-auto flex flex-col items-center py-16 md:py-24 px-4">
      <Badge variant="default" className="mb-8 px-5 py-4 rounded-full bg-primary-container/5 text-primary border-primary-container/20 hover:bg-primary-container/20 uppercase tracking-[0.2em] font-black text-[10px]">
        AI-POWERED STORE BUILDER
      </Badge>

      <h1 className="text-6xl md:text-8xl leading-[1.05] tracking-tight font-black text-foreground mb-10 max-w-4xl">
        Your store.<br />
        <span className="bg-linear-to-r from-primary-container to-secondary bg-clip-text text-transparent">One sentence</span>{" "}
        <span className="opacity-20">away.</span>
      </h1>

      <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
        Describe your business in plain English, and ShopSpell will generate a fully-featured e-commerce experience in seconds.
      </p>

      {/* Animated Input Mockup */}
      <div className="w-full max-w-3xl bg-card/50 backdrop-blur-sm rounded-3xl p-3 flex items-center shadow-2xl mb-16 border border-border/60 relative group transition-all hover:border-primary-container/30">
        <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center ml-2">
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        </div>

        <div className="flex-1 text-left pl-4 overflow-hidden">
          <div className="relative flex items-center h-12">
            <span className="text-lg md:text-xl text-foreground font-medium whitespace-nowrap">
              {displayText}
            </span>
            <span className={cn(
              "w-0.5 h-6 bg-primary-container ml-1 transition-opacity duration-100",
              isDeleting || displayText === TYPING_PHRASES[phraseIndex] ? "opacity-100" : "animate-pulse"
            )} />
          </div>
        </div>

        <Button size="icon" className="bg-primary text-on-primary rounded-2xl w-14 h-14 shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0 ml-4 group-hover:shadow-primary-container/20">
          <ArrowUp className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button size="lg" className="bg-primary text-on-primary font-bold px-12 py-8 rounded-full flex items-center gap-3 hover:opacity-90 transition-all shadow-2xl text-xl hover:-translate-y-0.5">
          Get Started
          <ArrowRight className="w-6 h-6" />
        </Button>
      </div>
    </section>
  );
}
