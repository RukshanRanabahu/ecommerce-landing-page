import { getProduct } from "@/services/productService";
import ProductDetails from "@/components/products/ProductDetails";

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;

  const product = await getProduct(id);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-10 md:py-16">
        <ProductDetails product={product} />
      </div>
    </main>
  );
}
