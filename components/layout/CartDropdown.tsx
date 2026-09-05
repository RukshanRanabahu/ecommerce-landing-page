"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";

interface CartDropdownProps {
  onClose: () => void;
}

export default function CartDropdown({ onClose }: CartDropdownProps) {
  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const cartTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const getProductQuantityInCart = (productId: string) => {
    return items
      .filter((item) => item.productId === productId)
      .reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-30"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute right-0 top-12 z-40 w-[340px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <span className="text-sm font-semibold text-gray-800">Your Cart</span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Cart items */}
        <div className="max-h-[400px] min-h-[160px] overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center gap-2 text-sm text-gray-400">
              <ShoppingBag className="h-8 w-8 opacity-30" />
              <span>Your cart is empty</span>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedOption?.type}-${String(item.selectedOption?.value)}`}
                  className="flex items-start gap-3"
                >
                  {/* Thumbnail */}
                  {/* Thumbnail */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={item.image ?? "/products/shirt-placeholder.jpg"}
                      alt={item.productName}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">
                      {item.brand}
                    </p>

                    <Link
                      href={`/products/${item.productId}`}
                      onClick={onClose}
                      className="block truncate text-sm font-semibold leading-tight text-gray-800 hover:text-gray-950"
                    >
                      {item.productName}
                    </Link>

                    {item.selectedOption && (
                      <p className="mt-1 text-xs text-gray-500">
                        {item.selectedOption.label}:{" "}
                        {String(item.selectedOption.value)}
                      </p>
                    )}

                    {/* Quantity */}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(item.productId, item.selectedOption)
                        }
                        className="flex h-7 w-7 items-center cursor-pointer justify-center rounded-md bg-gray-100 transition-colors hover:bg-gray-200"
                        aria-label={`Decrease quantity of ${item.productName}`}
                      >
                        <Minus className="h-3 w-3 text-gray-700 " />
                      </button>

                      <span className="w-4 text-center text-sm font-semibold text-gray-800">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(item.productId, item.selectedOption)
                        }
                        disabled={
                          getProductQuantityInCart(item.productId) >=
                          item.stockQuantity
                        }
                        className="flex h-7 w-7 items-center justify-center cursor-pointer rounded-md bg-gray-100 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Increase quantity of ${item.productName}`}
                      >
                        <Plus className="h-3 w-3 text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Price + remove */}
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(item.productId, item.selectedOption)
                      }
                      aria-label={`Remove ${item.productName} from cart`}
                      className="text-gray-400 transition-colors hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4 cursor-pointer" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total */}
        {items.length > 0 && (
          <div className="flex justify-between border-t border-gray-100 px-5 py-3 text-sm">
            <span className="font-medium text-gray-500">Total</span>

            <span className="font-bold text-gray-900">
              ${cartTotal.toFixed(2)}
            </span>
          </div>
        )}

        {/* Checkout */}
        <div className="px-5 pb-5 pt-2">
          <Link
            href="/checkout"
            onClick={onClose}
            className={`block w-full rounded-xl py-3.5 text-center text-sm font-semibold transition-colors ${
              items.length > 0
                ? "bg-green-500 text-white hover:bg-green-600"
                : "pointer-events-none bg-gray-200 text-gray-400"
            }`}
          >
            Continue To Checkout
          </Link>
        </div>
      </div>
    </>
  );
}
