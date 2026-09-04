"use client";

import { useEffect, useRef, useState } from "react";
import PriceFilterSlider from "./PriceFilterSlider";
import SortByDropdown, { type SortOption } from "./SortByDropdown";

interface PriceRange {
  min: number;
  max: number;
}

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;

  brands: string[];
  selectedBrands: string[];
  onBrandToggle: (brand: string) => void;

  priceRange: PriceRange;
  priceMin: number;
  priceMax: number;
  onPriceChange: (range: PriceRange) => void;

  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8l3.5 3.5L13 4" />
    </svg>
  );
}

interface DropdownProps {
  label: string;
  active: boolean;
  children: React.ReactNode;
}

function Dropdown({ label, active, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
          active
            ? "border-gray-800 bg-gray-800 text-white"
            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
        }`}
      >
        {label}

        <ChevronIcon
          className={`h-3.5 w-3.5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && children}
    </div>
  );
}

export default function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  brands,
  selectedBrands,
  onBrandToggle,
  onPriceChange,
  sortOption,
  onSortChange,
  priceRange,
  priceMin,
  priceMax,
}: ProductFiltersProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      {/* Category tabs */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onCategoryChange("all")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selectedCategory === "all"
              ? "bg-gray-900 text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:border-gray-400"
          }`}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-gray-900 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Dropdown filters */}
      <div className="flex items-center gap-2">
        <Dropdown label="Brand" active={selectedBrands.length > 0}>
          <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
            {brands.map((brand) => {
              const checked = selectedBrands.includes(brand);

              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => onBrandToggle(brand)}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      checked
                        ? "border-gray-800 bg-gray-800"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {checked && <CheckIcon className="h-3 w-3 text-white" />}
                  </span>

                  {brand}
                </button>
              );
            })}
          </div>
        </Dropdown>

        <Dropdown
          label="Price"
          active={priceRange.min > priceMin || priceRange.max < priceMax}
        >
          <div className="absolute right-0 top-full z-50 mt-2 w-80">
            <PriceFilterSlider
              min={priceMin}
              max={priceMax}
              value={priceRange}
              onChange={onPriceChange}
            />
          </div>
        </Dropdown>

        <SortByDropdown value={sortOption} onChange={onSortChange} />
      </div>
    </div>
  );
}
