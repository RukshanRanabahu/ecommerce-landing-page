"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function Header() {
  const items = useCartStore((state) => state.items);

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Flat Rock Tech
        </Link>

        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border px-4 py-2"
          >
            <span>Cart</span>

            {totalQuantity > 0 && (
              <span className="rounded-full bg-black px-2 py-0.5 text-xs text-white">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
