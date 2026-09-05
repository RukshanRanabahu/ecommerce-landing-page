"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import Toast, { type ToastType } from "@/components/ui/Toast";
import { getProductImage } from "@/lib/productImages";

interface QuickAddModalProps {
  product: Product;
  onClose: () => void;
}

export default function QuickAddModal({
  product,
  onClose,
}: QuickAddModalProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const [selectedOption, setSelectedOption] = useState<string | number | null>(
    null,
  );

  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const hasOption = product.selectible_option !== null;
  const isOutOfStock = product.stock_quantity <= 0;

  const handleAdd = () => {
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
      image: getProductImage(product.category),
      selectedOption: hasOption
        ? {
            type: product.selectible_option!.option_type,
            label: product.selectible_option!.option_name,
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

    window.setTimeout(onClose, 500);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-add-title"
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                id="quick-add-title"
                className="text-lg font-semibold text-gray-900"
              >
                Add to cart
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {product.product_name}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {hasOption && (
            <div className="mt-6">
              <label
                htmlFor="quick-add-option"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                {product.selectible_option!.option_name}
              </label>

              <select
                id="quick-add-option"
                value={selectedOption ?? ""}
                onChange={(event) => {
                  const value = event.target.value;

                  const matchedOption = product.selectible_option!.option.find(
                    (option) => String(option) === value,
                  );

                  setSelectedOption(matchedOption ?? null);
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-400"
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

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleAdd}
              disabled={isOutOfStock}
              className="flex-1 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isOutOfStock ? "Out of stock" : "Add to cart"}
            </button>
          </div>
        </div>
      </div>

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
