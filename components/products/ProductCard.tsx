"use client";

import Link from "next/link";
import { ShoppingCartPlus } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import QuickAddModal from "./QuickAddModal";
import Toast, { type ToastType } from "@/components/ui/Toast";
import { getProductImage } from "@/lib/productImages";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const hasOption = product.selectible_option !== null;
  const isOutOfStock = product.stock_quantity <= 0;

  const handleQuickAdd = () => {
    if (isOutOfStock) {
      setToast({
        message: "This product is out of stock.",
        type: "error",
      });
      return;
    }

    if (hasOption) {
      setShowQuickAdd(true);
      return;
    }

    const added = addToCart({
      productId: product.id,
      productName: product.product_name,
      price: product.price,
      quantity: 1,
      stockQuantity: product.stock_quantity,
      brand: product.brand,
      image: getProductImage(product.category),
    });

    if (!added) {
      setToast({
        message: "Not enough stock available.",
        type: "error",
      });
      return;
    }

    setToast({
      message: "Added to cart.",
      type: "success",
    });
  };

  return (
    <>
      <article className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
        {/* Product image */}
        <div className="relative aspect-[4/3] bg-[#f0f0f0]">
          <Link
            href={`/products/${product.id}`}
            className="relative block aspect-[4/3] overflow-hidden bg-[#f0f0f0]"
          >
            <Image
              src={getProductImage(product.category)}
              alt={product.product_name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </Link>

          {/* Quick Add */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            aria-label={`Add ${product.product_name} to cart`}
            className="absolute right-3 top-3 cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm transition-opacity hover:bg-gray-50 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCartPlus className="h-4 w-4 text-gray-700" />
          </button>
        </div>

        {/* Product information */}
        <div className="p-4">
          <Link href={`/products/${product.id}`}>
            <p className="text-sm font-semibold leading-tight text-gray-900 hover:underline">
              {product.product_name}
            </p>

            <p className="mt-0.5 text-xs text-gray-400">{product.brand}</p>

            <p className="mt-3 text-sm font-semibold text-gray-900">
              ${product.price.toFixed(2)}
            </p>
          </Link>

          {isOutOfStock && (
            <p className="mt-2 text-xs font-medium text-red-500">
              Out of stock
            </p>
          )}
        </div>
      </article>

      {showQuickAdd && (
        <QuickAddModal
          product={product}
          onClose={() => setShowQuickAdd(false)}
        />
      )}

      {toast && (
        <div className="fixed right-5 top-5 z-[100]">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </>
  );
}
