import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/modules/landing/presentation/components/Header";

const MOCK_PRODUCTS = [
  {
    id: 1,
    storeName: "Aura Essentials",
    title: "Hand-poured Soy Candle",
    price: "$28.00",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwXpoNDFcKTofFVPe62uwozbFZ1Ne8vm5w48jpzUG1RNVaaP6PZbwQzx1tAdLxIJ5wHIRKVwNBF2Lr4MIzrfG9vxwF10i719tfQzRmGo4sQ8aZG0H0_ZaUqjHCtHfPu14P9Uz_hn0mlRYqi-k4t8kBOS4qJ6lpe9I-280sqUxntk6QrJgOFkQrfR507ir9p9QnXJr0QSnEByqw1edJ3Cs92kdaS6KgF0dlAEYjEeh8NcnfJ05EAuW9mFPWSWky2ZZ2hgNNJ1j43-o",
    category: "Home Decor",
  },
  {
    id: 2,
    storeName: "Urban Gear",
    title: "Matte Thermal Flask",
    price: "$32.00",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9oTuAg6KM41jFzQ5ToEWUmVvF6ZXZnENt768Z5tt3di9bCCzY8Ce0U_RFe5zCz216i8DjYbOSsWoNp-0sriMPjFO9QCL4TIz2bl-nfcXUkGoG40vNzBNnWzBgialVlEYYlndkowd-8XF2JqcuVxSdoGCeX8EkVDkmgkRI3zj6wOFkgD0naUOrW4gZakNWS2BcG_SY_6qubsFWtWgw480uSaoYh82TZ9v4wZD96uObGf-iJ2BqpMgUTXzJdilwtcf7KnR_9TrJfDE",
    category: "Accessories",
  },
  {
    id: 3,
    storeName: "Lumina",
    title: "Brass Task Lamp",
    price: "$125.00",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCadEIiwdkyh3lJa5Q6yWog3FViwII3vc4C5EhjxZyaP3XBNI7Gr-pjXFqFSq0OqdX0O_YbO2rgEfUIiGu9PLqsBjqAcx_cELKG1eEamiN2XDxgmusJk_mem5FN8tG931BlnVebbjyd3P_c-gmEg1ksdcO2l85FNjFYfIJJzRwcTAGyj1t2mB4GUtHDvG1sKjaNiP2GiDzZ5s9wiy02SBHT9aaJ81Q7Hwl81B5eFrcdGdKrt9xs4MFdSL582qHUHsKG3odsScvGs_o",
    category: "Lighting",
  },
  {
    id: 4,
    storeName: "Velocity Kicks",
    title: "Crimson Runner",
    price: "$120.00",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFf_uYo3BIXtz1SSKQ2zOoXNqjHEFK9zcywRzVcr0q2QuhaDcwx6vZP5pzcxfEMWm1wQMwV5vIAiDFZ2tVVISlQE79JD2KW85tWAYh6CzLaIlJpN0d__65qTBJH-LPJ0MmbJ7TjcaSJLHcBg6eb4vFRlorMZvH0XeqNNzbbxV4fWqcxF9Xyj1fZ9u2Z3xQtZrcJdIzKm6HiWGbiJq7b4TOCLJA5tlafDiJ8hru9Iww2Ko4adQ-yLqGYkYbs_Ta4Yrl9EN9gwVmszs",
    category: "Footwear",
  },
  {
    id: 5,
    storeName: "Minimalist Life",
    title: "Ceramic Coffee Mug",
    price: "$18.00",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop",
    category: "Kitchen",
  },
  {
    id: 6,
    storeName: "Tech Haven",
    title: "Ergonomic Keyboard",
    price: "$145.00",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop",
    category: "Electronics",
  },
];

export function ExplorePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="grow w-full max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-20 flex flex-col gap-12">

        {/* Explore Hero Header */}
        <section className="bg-surface-container-low rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm border border-border/50 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/20 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

          <div className="flex flex-col gap-6 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-label-caps tracking-widest text-xs w-fit">
              <span className="material-symbols-outlined text-[16px]">travel_explore</span>
              <span>ShopSpell Marketplace</span>
            </div>
            <h1 className="font-h1 text-3xl md:text-4xl lg:text-5xl text-on-surface leading-tight">
              Discover amazing products from independent stores.
            </h1>
            <p className="font-body-lg text-lg text-on-surface-variant leading-relaxed">
              Browse through a curated collection of products created by sellers worldwide. Inspired? Start your own journey today.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-8 bg-surface-container-lowest rounded-3xl shadow-xl shadow-black/5 border border-border relative z-10 min-w-[300px]">
            <span className="material-symbols-outlined text-5xl text-primary-container mb-4">
              storefront
            </span>
            <h3 className="font-h3 text-xl font-bold mb-2">Want to sell?</h3>
            <p className="text-center text-sm text-on-surface-variant mb-6">
              Create your own AI-powered storefront in minutes.
            </p>
            <Link href="/onboarding" className="w-full">
              <Button className="w-full rounded-full bg-primary-container hover:bg-primary-container/90 text-white font-bold py-6 text-md shadow-lg shadow-primary-container/20 transition-transform active:scale-95">
                Create Your Store
              </Button>
            </Link>
          </div>
        </section>

        {/* Product Grid */}
        <section className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="font-h2 text-3xl text-on-surface">Trending Products</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {["All", "Home Decor", "Accessories", "Lighting", "Footwear"].map((cat, i) => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded-full font-label-caps text-xs tracking-widest uppercase whitespace-nowrap transition-colors ${i === 0
                    ? "bg-primary-container text-white"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_PRODUCTS.map((product) => (
              <article
                key={product.id}
                className="bg-surface-container-lowest rounded-3xl shadow-sm hover:shadow-xl hover:shadow-black/5 border border-border/50 overflow-hidden flex flex-col group cursor-pointer transition-all duration-300"
              >
                <div className="h-64 bg-surface-container-low relative p-4 flex items-center justify-center overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    unoptimized
                    className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay Store Name Badge */}
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-border/50 z-10">
                    <span className="material-symbols-outlined text-[14px] text-primary-container">store</span>
                    <span className="text-xs font-semibold">{product.storeName}</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <span className="font-label-caps text-[10px] text-primary-container uppercase tracking-widest">
                    {product.category}
                  </span>
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-h3 text-xl font-bold text-on-background leading-tight group-hover:text-primary-container transition-colors">
                      {product.title}
                    </h3>
                    <span className="font-body-lg font-bold text-on-surface">
                      {product.price}
                    </span>
                  </div>
                  <Button variant="outline" className="mt-4 rounded-full border-border/50 hover:border-primary-container hover:text-primary-container transition-colors">
                    View Product
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
