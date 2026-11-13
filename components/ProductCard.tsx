"use client";

import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onAddToOrder: () => void;
}

export default function ProductCard({
  product,
  onAddToOrder,
}: ProductCardProps) {
  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(priceCents / 100);
  };

  return (
    <main className="mx-auto w-full max-w-[960px] px-4 py-8">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div
          role="img"
          aria-label={product.name}
          className="aspect-[4/3] w-full rounded-lg bg-gray-200"
        />

        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>

          <p className="text-gray-600">{product.description}</p>

          <p className="text-xl font-semibold md:text-2xl">
            {formatPrice(product.priceCents)}
          </p>

          <button
            onClick={onAddToOrder}
            className="min-h-11 w-full rounded-md bg-[#1F4D3A] px-6 py-3 font-medium text-white hover:bg-[#173b2c] md:w-fit"
          >
            Add to order
          </button>
        </div>
      </div>
    </main>
  );
}
