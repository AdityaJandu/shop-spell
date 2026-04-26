import React from "react";
import { Button } from "@/components/ui/button";

export function AddProductDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-on-background/10 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-[480px] bg-surface-container-lowest shadow-[-8px_0_24px_rgba(0,0,0,0.08)] z-50 flex flex-col transition-transform duration-300 ease-in-out border-l border-surface-variant ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-container-high">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container">
              auto_fix_high
            </span>
            <h2 className="font-h3 text-h3 text-on-background">Add a product</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          {/* AI Input Section */}
          <div className="flex flex-col gap-3">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
              ShopSpell AI Assistant
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-container/10 to-secondary/10 rounded-xl blur-md opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
              <textarea
                className="relative w-full bg-surface-container-low border-none rounded-xl p-4 font-body-md text-body-md text-on-background placeholder:text-stone-400 focus:ring-1 focus:ring-primary-container resize-none"
                placeholder="Describe the product naturally... e.g. 'Add a hand-poured soy candle with cedarwood scent for $28'"
                rows={3}
              ></textarea>
              <button className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center shadow-sm hover:opacity-90">
                <span className="material-symbols-outlined text-lg">
                  arrow_upward
                </span>
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-surface-container-high"></div>

          {/* Manual Form Fields */}
          <form className="flex flex-col gap-6">
            {/* Image Upload Area */}
            <div className="w-full h-40 border-2 border-dashed border-surface-container-highest rounded-xl bg-surface-container-low flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-stone-400 text-3xl">
                add_photo_alternate
              </span>
              <span className="font-body-md text-body-md text-stone-500 font-medium">
                Upload product images
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                Product Name
              </label>
              <input
                className="w-full h-12 bg-surface-container-low rounded-lg px-4 border-none font-body-md text-body-md text-on-background focus:ring-1 focus:ring-primary-container"
                type="text"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-md">
                    $
                  </span>
                  <input
                    className="w-full h-12 bg-surface-container-low rounded-lg pl-8 pr-4 border-none font-body-md text-body-md text-on-background focus:ring-1 focus:ring-primary-container"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                  Stock
                </label>
                <input
                  className="w-full h-12 bg-surface-container-low rounded-lg px-4 border-none font-body-md text-body-md text-on-background focus:ring-1 focus:ring-primary-container"
                  type="number"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                Category
              </label>
              <select className="w-full h-12 bg-surface-container-low rounded-lg px-4 border-none font-body-md text-body-md text-on-background focus:ring-1 focus:ring-primary-container appearance-none">
                <option>Select a category...</option>
                <option>Home Decor</option>
                <option>Apparel</option>
                <option>Accessories</option>
              </select>
            </div>
          </form>
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-surface-container-high flex justify-end gap-3 bg-surface-container-lowest">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-3 rounded-full bg-white text-on-background font-body-md text-body-md font-medium shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:bg-surface-container-low transition-colors border-none h-auto"
          >
            Cancel
          </Button>
          <Button
            className="px-6 py-3 rounded-full bg-primary-container text-white font-body-md text-body-md font-semibold shadow-[0_2px_12px_rgba(244,97,78,0.2)] hover:opacity-90 transition-opacity h-auto"
          >
            Save Product
          </Button>
        </div>
      </aside>
    </>
  );
}
