import React from "react";

export function HowItWorks() {
  return (
    <section className="w-full mt-32 max-w-5xl">
      <div className="text-center mb-16">
        <h2 className="font-h2 text-h2 text-on-background">
          From idea to inventory.
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">
          Three steps to launch your digital boutique.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {/* Step 1 */}
        <div className="bg-surface-container-lowest p-lg rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-outline-variant/20 flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
          <span className="font-label-caps text-label-caps text-secondary mb-md">
            01 DESCRIBE IT
          </span>
          <div className="w-12 h-12 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary mb-6">
            <span className="material-symbols-outlined">chat</span>
          </div>
          <h3 className="font-h3 text-[20px] text-on-background mb-2">
            Talk to your architect
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Tell ShopSpell AI what you sell and how you want it to feel. It
            listens, understands context, and begins drafting.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-surface-container-lowest p-lg rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-outline-variant/20 flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
          <span className="font-label-caps text-label-caps text-secondary mb-md">
            02 REFINE IT
          </span>
          <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container mb-6">
            <span className="material-symbols-outlined">tune</span>
          </div>
          <h3 className="font-h3 text-[20px] text-on-background mb-2">
            Tweak and iterate
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Review the live preview. Ask for changes like &quot;make it warmer&quot; or
            &quot;add a newsletter signup&quot; and watch it update instantly.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-surface-container-lowest p-lg rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-outline-variant/20 flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
          <span className="font-label-caps text-label-caps text-secondary mb-md">
            03 LAUNCH IT
          </span>
          <div className="w-12 h-12 rounded-full bg-tertiary-container/20 flex items-center justify-center text-on-tertiary-container mb-6">
            <span className="material-symbols-outlined">rocket_launch</span>
          </div>
          <h3 className="font-h3 text-[20px] text-on-background mb-2">
            Publish to the world
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Connect your domain, add your payment details securely, and click
            publish. You&apos;re ready to accept orders.
          </p>
        </div>
      </div>
    </section>
  );
}
