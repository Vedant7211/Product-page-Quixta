"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import OrderDialog from "@/components/OrderDialog";
import type { Product } from "@/types/product";

export default function Home() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function getProduct() {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch("/api/product");
      if (!response.ok) {
        throw new Error("failed to fetch the product");
      }

      const data = await response.json();
      setProduct(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProduct();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-900">
        Loading product…
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-gray-900">
        <p>Could not load the product</p>
        <button
          onClick={getProduct}
          className="rounded-md bg-[#1F4D3A] px-6 py-3 text-white hover:bg-[#173b2c]"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <ProductCard
        product={product}
        onAddToOrder={() => setIsDialogOpen(true)}
      />
      {isDialogOpen && (
        <OrderDialog
          product={product}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
}
