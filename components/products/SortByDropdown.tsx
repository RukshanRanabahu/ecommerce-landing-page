"use client";

import { useEffect, useRef, useState } from "react";

export type SortOption =
  | "release_desc"
  | "release_asc"
  | "price_desc"
  | "price_asc";

interface SortOptionItem {
  label: string;
  value: SortOption;
}

interface SortByDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: SortOptionItem[] = [
  {
    label: "Release Date: Desc",
    value: "release_desc",
  },
  {
    label: "Release Date: Asc",
    value: "release_asc",
  },
  {
    label: "Price: Desc",
    value: "price_desc",
  },
  {
    label: "Price: Asc",
    value: "price_asc",
  },
];

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function SortByDropdown({
  value,
  onChange,
}: SortByDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = SORT_OPTIONS.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: SortOption) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full max-w-xs">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 focus:outline-none"
      >
        <span className="font-medium text-red-500">
          {selectedOption?.label}
        </span>

        <ChevronIcon
          className={`h-4 w-4 text-gray-400 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          {SORT_OPTIONS.map((option) => {
            const isActive = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 ${
                  isActive
                    ? "font-semibold text-red-500"
                    : "font-normal text-gray-700"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
