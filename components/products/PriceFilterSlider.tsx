"use client";

interface PriceRange {
  min: number;
  max: number;
}

interface PriceFilterSliderProps {
  min: number;
  max: number;
  value: PriceRange;
  onChange: (range: PriceRange) => void;
}

export default function PriceFilterSlider({
  min,
  max,
  value,
  onChange,
}: PriceFilterSliderProps) {
  const minValue = Math.max(min, Math.min(value.min, value.max));
  const maxValue = Math.min(max, Math.max(value.max, value.min));

  const range = max - min;

  const minPercent = range > 0 ? ((minValue - min) / range) * 100 : 0;

  const maxPercent = range > 0 ? ((maxValue - min) / range) * 100 : 100;

  const clamp = (number: number, lower: number, upper: number) =>
    Math.min(Math.max(number, lower), upper);

  const updateMin = (rawValue: number) => {
    const newValue = clamp(rawValue, min, maxValue);

    onChange({
      min: newValue,
      max: maxValue,
    });
  };

  const updateMax = (rawValue: number) => {
    const newValue = clamp(rawValue, minValue, max);

    onChange({
      min: minValue,
      max: newValue,
    });
  };

  const parseInput = (input: string, fallback: number) => {
    const cleaned = input.replace(/\D/g, "");

    if (cleaned === "") {
      return fallback;
    }

    const parsed = Number(cleaned);

    return Number.isFinite(parsed) ? parsed : fallback;
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-5 text-xs font-medium uppercase tracking-wide text-gray-400">
        Price Filter
      </p>

      {/* Slider */}
      <div className="relative mb-6 h-5">
        {/* Base track */}
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-gray-200" />

        {/* Active range */}
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-blue-500"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />

        {/* Minimum range input */}
        <input
          type="range"
          min={min}
          max={maxValue}
          step={1}
          value={minValue}
          onChange={(event) => updateMin(Number(event.target.value))}
          aria-label="Minimum price"
          className="absolute inset-0 h-5 w-full cursor-pointer appearance-none bg-transparent opacity-0"
          style={{
            zIndex: minValue >= maxValue ? 5 : 3,
          }}
        />

        {/* Maximum range input */}
        <input
          type="range"
          min={minValue}
          max={max}
          step={1}
          value={maxValue}
          onChange={(event) => updateMax(Number(event.target.value))}
          aria-label="Maximum price"
          className="absolute inset-0 h-5 w-full cursor-pointer appearance-none bg-transparent opacity-0"
          style={{
            zIndex: maxValue <= minValue ? 5 : 4,
          }}
        />

        {/* Minimum thumb */}
        <div
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-blue-500 shadow"
          style={{
            left: `calc(${minPercent}% - 8px)`,
          }}
        />

        {/* Maximum thumb */}
        <div
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-blue-300 bg-white shadow"
          style={{
            left: `calc(${maxPercent}% - 8px)`,
          }}
        />
      </div>

      {/* Price inputs */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            $
          </span>

          <input
            type="text"
            inputMode="numeric"
            value={minValue}
            onChange={(event) => updateMin(parseInput(event.target.value, min))}
            aria-label="Minimum price"
            className="w-full rounded-full border border-gray-200 py-2 pl-6 pr-3 text-center text-sm text-gray-700 outline-none focus:border-blue-400"
          />
        </div>

        <span className="text-sm text-gray-400">—</span>

        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            $
          </span>

          <input
            type="text"
            inputMode="numeric"
            value={maxValue}
            onChange={(event) => updateMax(parseInput(event.target.value, max))}
            aria-label="Maximum price"
            className="w-full rounded-full border border-gray-200 py-2 pl-6 pr-3 text-center text-sm text-gray-700 outline-none focus:border-blue-400"
          />
        </div>
      </div>
    </div>
  );
}
