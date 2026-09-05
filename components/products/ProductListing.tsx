"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/types/product";
import ProductFilters from "./ProductFilters";
import ProductGrid from "./ProductGrid";
import { type SortOption } from "./SortByDropdown";

interface ProductListingProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 16;

export default function ProductListing({ products }: ProductListingProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") ?? "all";

  const brandParam = searchParams.get("brand");

  const selectedBrands = useMemo(
    () => (brandParam ? brandParam.split(",") : []),
    [brandParam],
  );

  const sortParam = searchParams.get("sort");

  const sortOption: SortOption =
    sortParam === "release_asc" ||
    sortParam === "price_desc" ||
    sortParam === "price_asc"
      ? sortParam
      : "release_desc";

  const pageParam = searchParams.get("page");

  const currentPage = Math.max(
    1,
    Number.isNaN(Number(pageParam)) ? 1 : Number(pageParam),
  );

  const priceBounds = useMemo(() => {
    if (products.length === 0) {
      return {
        min: 0,
        max: 1000,
      };
    }

    const prices = products.map((product) => product.price);

    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");

  const priceRange = useMemo(
    () => ({
      min: minPriceParam ? Number(minPriceParam) : priceBounds.min,
      max: maxPriceParam ? Number(maxPriceParam) : priceBounds.max,
    }),
    [minPriceParam, maxPriceParam, priceBounds],
  );

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    [products],
  );

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand))],
    [products],
  );

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);

      const matchesPrice =
        product.price >= priceRange.min && product.price <= priceRange.max;

      return matchesCategory && matchesBrand && matchesPrice;
    });

    switch (sortOption) {
      case "release_asc":
        return [...filtered].sort(
          (a, b) =>
            new Date(a.release_date).getTime() -
            new Date(b.release_date).getTime(),
        );

      case "price_desc":
        return [...filtered].sort((a, b) => b.price - a.price);

      case "price_asc":
        return [...filtered].sort((a, b) => a.price - b.price);

      case "release_desc":
      default:
        return filtered;
    }
  }, [products, selectedCategory, selectedBrands, priceRange, sortOption]);

  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / ITEMS_PER_PAGE,
  );
  const safeCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [filteredAndSortedProducts, safeCurrentPage]);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    params.delete("page");

    router.replace(
      `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
      {
        scroll: false,
      },
    );
  };

  const handleBrandToggle = (brand: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const currentBrands = params.get("brand")
      ? params.get("brand")!.split(",")
      : [];

    const updatedBrands = currentBrands.includes(brand)
      ? currentBrands.filter((currentBrand) => currentBrand !== brand)
      : [...currentBrands, brand];

    if (updatedBrands.length === 0) {
      params.delete("brand");
    } else {
      params.set("brand", updatedBrands.join(","));
    }

    params.delete("page");

    router.replace(
      `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
      {
        scroll: false,
      },
    );
  };

  const handleSortChange = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());

    if (sort === "release_desc") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }

    params.delete("page");

    router.replace(
      `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
      { scroll: false },
    );
  };

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    router.replace(
      `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
      { scroll: false },
    );
  };

  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Products</h1>

        <ProductFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          brands={brands}
          selectedBrands={selectedBrands}
          onBrandToggle={handleBrandToggle}
          priceRange={priceRange}
          priceMin={priceBounds.min}
          priceMax={priceBounds.max}
          onPriceChange={(range) => {
            const params = new URLSearchParams(searchParams.toString());

            if (range.min <= priceBounds.min) {
              params.delete("minPrice");
            } else {
              params.set("minPrice", String(range.min));
            }

            if (range.max >= priceBounds.max) {
              params.delete("maxPrice");
            } else {
              params.set("maxPrice", String(range.max));
            }

            params.delete("page");

            router.replace(
              `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
              {
                scroll: false,
              },
            );
          }}
          sortOption={sortOption}
          onSortChange={handleSortChange}
        />

        {paginatedProducts.length > 0 ? (
          <ProductGrid products={paginatedProducts} />
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-gray-400">
            No products match your filters.
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => updatePage(Math.max(1, safeCurrentPage - 1))}
              disabled={safeCurrentPage === 1}
              className="px-3 py-1.5 text-sm text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => updatePage(page)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                    safeCurrentPage === page
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() =>
                updatePage(Math.min(totalPages, safeCurrentPage + 1))
              }
              disabled={safeCurrentPage === totalPages}
              className="px-3 py-1.5 text-sm text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
