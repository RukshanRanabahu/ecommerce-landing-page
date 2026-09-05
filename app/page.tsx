import { Suspense } from "react";
import ProductListing from "@/components/products/ProductListing";
import { getProducts } from "@/services/productService";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f5f7]" />}>
      <ProductListing products={products} />
    </Suspense>
  );
}