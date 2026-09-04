import Link from "next/link";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 md:py-16">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
            ← Continue Shopping
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <CheckoutForm />
      </div>
    </main>
  );
}
