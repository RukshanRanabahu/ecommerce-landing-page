import Link from "next/link";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[4/3] bg-[#f0f0f0]">
          <div className="flex h-full items-center justify-center">
            <span className="text-sm text-gray-400">Product Image</span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <p className="text-sm font-semibold leading-tight text-gray-900">
            {product.product_name}
          </p>

          <p className="mt-0.5 text-xs text-gray-400">{product.brand}</p>

          <p className="mt-3 text-sm font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
        </Link>

        {isOutOfStock && (
          <p className="mt-2 text-xs font-medium text-red-500">Out of stock</p>
        )}
      </div>
    </article>
  );
}
