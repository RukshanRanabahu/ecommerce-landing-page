import ProductListing from "@/components/products/ProductListing";
import { getProducts } from "@/services/productService";

export default async function HomePage() {
  const products = await getProducts();

  return <ProductListing products={products} />;
}