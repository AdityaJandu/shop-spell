import React from "react";
import Image from "next/image";

const products = [
  {
    category: "Home Decor",
    title: "Artisan Fluted Vase",
    price: "$48.00",
    stockStatus: "In stock (12)",
    stockColor: "bg-secondary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwXpoNDFcKTofFVPe62uwozbFZ1Ne8vm5w48jpzUG1RNVaaP6PZbwQzx1tAdLxIJ5wHIRKVwNBF2Lr4MIzrfG9vxwF10i719tfQzRmGo4sQ8aZG0H0_ZaUqjHCtHfPu14P9Uz_hn0mlRYqi-k4t8kBOS4qJ6lpe9I-280sqUxntk6QrJgOFkQrfR507ir9p9QnXJr0QSnEByqw1edJ3Cs92kdaS6KgF0dlAEYjEeh8NcnfJ05EAuW9mFPWSWky2ZZ2hgNNJ1j43-o",
  },
  {
    category: "Accessories",
    title: "Matte Thermal Flask",
    price: "$32.00",
    stockStatus: "In stock (45)",
    stockColor: "bg-secondary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9oTuAg6KM41jFzQ5ToEWUmVvF6ZXZnENt768Z5tt3di9bCCzY8Ce0U_RFe5zCz216i8DjYbOSsWoNp-0sriMPjFO9QCL4TIz2bl-nfcXUkGoG40vNzBNnWzBgialVlEYYlndkowd-8XF2JqcuVxSdoGCeX8EkVDkmgkRI3zj6wOFkgD0naUOrW4gZakNWS2BcG_SY_6qubsFWtWgw480uSaoYh82TZ9v4wZD96uObGf-iJ2BqpMgUTXzJdilwtcf7KnR_9TrJfDE",
  },
  {
    category: "Lighting",
    title: "Brass Task Lamp",
    price: "$125.00",
    stockStatus: "Low stock (3)",
    stockColor: "bg-[#f4614e]",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCadEIiwdkyh3lJa5Q6yWog3FViwII3vc4C5EhjxZyaP3XBNI7Gr-pjXFqFSq0OqdX0O_YbO2rgEfUIiGu9PLqsBjqAcx_cELKG1eEamiN2XDxgmusJk_mem5FN8tG931BlnVebbjyd3P_c-gmEg1ksdcO2l85FNjFYfIJJzRwcTAGyj1t2mB4GUtHDvG1sKjaNiP2GiDzZ5s9wiy02SBHT9aaJ81Q7Hwl81B5eFrcdGdKrt9xs4MFdSL582qHUHsKG3odsScvGs_o",
  },
];

export function ProductGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
      {products.map((product, index) => (
        <article
          key={index}
          className="bg-surface-container-lowest rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col group cursor-pointer hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300"
        >
          <div className="h-56 bg-surface-container-low relative p-4 flex items-center justify-center overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              width={300}
              height={224}
              unoptimized
              className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-5 flex flex-col gap-2">
            <span className="font-label-caps text-label-caps text-primary-container uppercase tracking-widest">
              {product.category}
            </span>
            <div className="flex justify-between items-start gap-4">
              <h3 className="font-body-lg text-body-lg font-bold text-on-background leading-tight">
                {product.title}
              </h3>
              <span className="font-body-lg text-body-lg text-on-surface-variant font-medium">
                {product.price}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`w-2 h-2 rounded-full ${product.stockColor}`}
              ></span>
              <span className="font-body-md text-body-md text-on-surface-variant text-sm">
                {product.stockStatus}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
