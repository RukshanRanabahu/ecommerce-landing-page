import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <article className="overflow-hidden rounded-lg border bg-white">
      <div className="flex aspect-square items-center justify-center bg-gray-100">
        <span className="text-sm text-gray-400">Product Image</span>
      </div>

      <div className="p-4">
        <p className="mb-1 text-sm text-gray-500">{product.brand}</p>

        <h2 className="font-semibold text-gray-900">{product.product_name}</h2>

        <p className="mt-2 font-medium text-gray-900">
          ${product.price.toFixed(2)}
        </p>

        {isOutOfStock && (
          <p className="mt-2 text-sm font-medium text-red-600">Out of stock</p>
        )}
      </div>
    </article>
  );
}
