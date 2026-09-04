"use client";

import { useState } from "react";
import Toast, { type ToastType } from "@/components/ui/Toast";
import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const [selectedOption, setSelectedOption] = useState<string | number | null>(
    null,
  );

  const hasOption = product.selectible_option !== null;
  const isOutOfStock = product.stock_quantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      setToast({
        message: "This product is out of stock.",
        type: "error",
      });
      return;
    }

    if (hasOption && selectedOption === null) {
      setToast({
        message: "Please select an option.",
        type: "warning",
      });
      return;
    }

    const added = addToCart({
      productId: product.id,
      productName: product.product_name,
      price: product.price,
      quantity: 1,
      stockQuantity: product.stock_quantity,
      brand: product.brand,
      selectedOption: hasOption
        ? {
            type: product.selectible_option!.option_type,
            value: selectedOption!,
          }
        : undefined,
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
    <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
      {/* Product Image */}
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
        <span className="text-sm text-gray-400">Product Image</span>
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            {product.product_name}
          </h1>

          <p className="mt-1 font-medium text-gray-500">{product.brand}</p>
        </div>

        <p className="text-2xl font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </p>

        <p className="text-sm leading-relaxed text-gray-600">
          {product.description}
        </p>

        {/* Product Option */}
        {hasOption && (
          <div>
            <label
              htmlFor="product-option"
              className="mb-1.5 block text-xs font-medium text-gray-500"
            >
              {product.selectible_option!.option_name}
            </label>

            <select
              id="product-option"
              value={selectedOption ?? ""}
              onChange={(event) => {
                const value = event.target.value;

                const matchedOption = product.selectible_option!.option.find(
                  (option) => String(option) === value,
                );

                setSelectedOption(matchedOption ?? null);
              }}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select Option</option>

              {product.selectible_option!.option.map((option) => (
                <option key={String(option)} value={String(option)}>
                  {String(option)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full rounded-xl bg-gray-900 py-3.5 font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isOutOfStock ? "Out of stock" : "Add to cart"}
        </button>

        {/* Stock */}
        <div className="flex flex-col gap-1 text-sm">
          <span className="text-gray-500">
            Available Quantity:{" "}
            <span className="font-semibold text-green-600">
              {product.stock_quantity}
            </span>
          </span>

          {isOutOfStock && (
            <span className="font-medium text-red-500">Out of stock</span>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed left-4 right-4 top-4 z-[100] sm:left-auto sm:right-5 sm:top-5">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
}
