import React from "react";

export function Hero() {
  return (
    <section className="text-center max-w-4xl mx-auto flex flex-col items-center">
      <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-md bg-secondary-container/20 px-4 py-1.5 rounded-full">
        AI-POWERED STORE BUILDER
      </span>
      <h1 className="font-h1 text-[56px] leading-[1.1] tracking-[-0.03em] font-extrabold text-on-background mb-xl mt-sm max-w-3xl">
        Your store.<br />
        <span className="text-primary-container">One sentence</span>{" "}
        <span className="text-secondary">away.</span>
      </h1>
      
      {/* Animated Input Mockup */}
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-full p-sm flex items-center shadow-[0_8px_24px_rgba(0,0,0,0.08)] mb-xl border border-outline-variant/30 relative">
        <span className="material-symbols-outlined text-outline ml-md">
          colors_spark
        </span>
        <div className="flex-1 text-left pl-sm overflow-hidden">
          <p className="font-body-lg text-body-lg text-on-surface-variant whitespace-nowrap overflow-hidden border-r-2 border-primary-container pr-1 inline-block">
            I sell handmade candles with organic essential oils...
          </p>
        </div>
        <button className="bg-primary-container text-on-primary rounded-full w-12 h-12 flex items-center justify-center shadow-[0_2px_12px_rgba(244,97,78,0.3)] hover:scale-105 transition-transform shrink-0">
          <span className="material-symbols-outlined">arrow_upward</span>
        </button>
      </div>

      <button className="bg-primary-container text-on-primary font-body-lg text-body-lg font-bold px-10 py-4 rounded-full flex items-center gap-sm hover:opacity-90 transition-all shadow-[0_4px_16px_rgba(244,97,78,0.2)]">
        Start for free
        <span className="material-symbols-outlined">arrow_right_alt</span>
      </button>
    </section>
  );
}
