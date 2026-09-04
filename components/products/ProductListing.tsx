"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import ProductFilters from "./ProductFilters";
import ProductGrid from "./ProductGrid";
import { type SortOption } from "./SortByDropdown";

interface ProductListingProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 8;

export default function ProductListing({ products }: ProductListingProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("release_desc");
  const [currentPage, setCurrentPage] = useState(1);

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

  const [priceRange, setPriceRange] = useState(priceBounds);

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

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [filteredAndSortedProducts, currentPage]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((current) =>
      current.includes(brand)
        ? current.filter((item) => item !== brand)
        : [...current, brand],
    );

    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
    setCurrentPage(1);
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
            setPriceRange(range);
            setCurrentPage(1);
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
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
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
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
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
