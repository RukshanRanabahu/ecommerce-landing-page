"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

function ShoppingBagIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

export default function Header() {
  const items = useCartStore((state) => state.items);

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-nunito)] text-xl font-extrabold italic tracking-tight text-gray-900"
        >
          Flat Rock Tech
        </Link>

        <button
          type="button"
          aria-label="Open shopping cart"
          className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
        >
          <ShoppingBagIcon className="h-5 w-5 text-gray-700" />

          {totalQuantity > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              {totalQuantity}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
