import React from "react";
import Image from "next/image";

export function BrowserMockup() {
  return (
    <section className="w-full mt-32 px-4 md:px-0">
      <div className="w-full bg-surface-container-lowest rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.1)] border border-outline-variant/50 overflow-hidden flex flex-col h-[600px]">
        {/* Browser Header */}
        <div className="h-12 bg-surface-container-low border-b border-outline-variant/30 flex items-center px-lg gap-2">
          <div className="w-3 h-3 rounded-full bg-outline-variant"></div>
          <div className="w-3 h-3 rounded-full bg-outline-variant"></div>
          <div className="w-3 h-3 rounded-full bg-outline-variant"></div>
          <div className="mx-auto bg-surface-container-lowest rounded-full px-8 py-1 flex items-center gap-sm border border-outline-variant/30 text-xs text-on-surface-variant font-code text-code">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            shopspell.ai/builder
          </div>
        </div>

        {/* Split Screen Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-surface">
          {/* Left: Chat UI */}
          <div className="w-full md:w-1/3 border-r border-outline-variant/30 bg-surface-container-low/50 flex flex-col p-lg">
            <div className="flex items-center gap-sm mb-lg">
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined icon-fill text-[18px]">
                  magic_button
                </span>
              </div>
              <span className="font-body-md text-body-md font-semibold text-on-background">
                ShopSpell AI
              </span>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-md pr-2">
              {/* User Message */}
              <div className="bg-surface-container-lowest p-md rounded-2xl rounded-tr-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] self-end max-w-[85%] border border-outline-variant/20">
                <p className="font-body-md text-body-md text-on-background">
                  I need a clean, minimalist store for my artisan candles. Mostly warm tones.
                </p>
              </div>

              {/* AI Response */}
              <div className="bg-surface-container p-md rounded-2xl rounded-tl-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] self-start max-w-[90%]">
                <p className="font-body-md text-body-md text-on-background mb-sm">
                  I&apos;ve generated a warm, minimalist layout utilizing our &apos;Editorial&apos; theme block. I added a gallery for your candle collections.
                </p>
                <div className="bg-surface-container-lowest rounded-lg p-sm flex items-center gap-sm border border-outline-variant/30">
                  <span className="material-symbols-outlined text-secondary">
                    check_circle
                  </span>
                  <span className="font-code text-code text-on-surface-variant">
                    Applied &apos;Warm Editorial&apos; palette
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-lg relative">
              <input
                className="w-full bg-surface-container-lowest border-none rounded-full py-3 pl-4 pr-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-body-md text-body-md focus:ring-2 focus:ring-primary-container outline-none"
                placeholder="Tweak the design..."
                type="text"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-container">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>

          {/* Right: Preview UI */}
          <div className="w-full md:w-2/3 bg-background relative overflow-hidden flex flex-col items-center justify-center p-xl">
            {/* Simulated Storefront */}
            <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col h-full border border-outline-variant/20">
              <div className="h-48 bg-surface-container w-full relative">
                <Image
                  alt="artisanal handmade candle burning on a clean marble surface"
                  className="w-full h-full object-cover opacity-80 mix-blend-multiply"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeEaDLRDc3rGTvLUu3TjR8gewnWPla_C-JH5oty1IkvKdr5qtoPwoAn1U8HcV5645xHXQVhqE9Kb9pKPpr9UKhDpRGrUZtSwF1Y-CGwaJxxFkwroBb51ZlvXq9IoHCli5I53tR-RpRdrsAmSYMR2dPNH3675EB_V0MehmDgR9Ki8XavVe3x-G11UHSurR3dLe53uYDykclQZUrqj_Bf73CANL3oPgUaul1uTjGGIeFk8l92CgzZLh7n0bbcI5Oo9AeVm-VyVgTm2M"
                  width={800}
                  height={600}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent"></div>
                <div className="absolute top-4 left-6 font-h3 text-h3 font-bold text-on-surface">
                  Lumina
                </div>
                <div className="absolute top-4 right-6 flex gap-4">
                  <span className="material-symbols-outlined text-on-surface">
                    search
                  </span>
                  <span className="material-symbols-outlined text-on-surface">
                    shopping_bag
                  </span>
                </div>
              </div>

              <div className="p-lg flex-1 flex flex-col items-center text-center">
                <h2 className="font-h2 text-[24px] font-bold text-on-background mb-2">
                  Hand-poured ambiance.
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-xs">
                  Crafted with organic essential oils and sustainable soy wax for a cleaner burn.
                </p>
                <button className="bg-on-background text-on-primary font-body-md text-body-md px-6 py-2 rounded-full">
                  Shop Collection
                </button>
                <div className="w-full flex gap-sm mt-auto pt-6">
                  <div className="flex-1 h-32 bg-surface-container rounded-lg"></div>
                  <div className="flex-1 h-32 bg-surface-container rounded-lg"></div>
                </div>
              </div>
            </div>

            {/* Floating status indicator */}
            <div className="absolute top-6 right-6 bg-surface-container-lowest rounded-full px-4 py-2 shadow-md flex items-center gap-2 border border-outline-variant/30">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                LIVE PREVIEW
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
