"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

export type ToastType = "success" | "info" | "warning" | "error";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const config: Record<
  ToastType,
  {
    border: string;
    bg: string;
    icon: ReactNode;
    label: string;
  }
> = {
  success: {
    border: "border-green-500",
    bg: "bg-green-50",
    label: "text-green-700",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" className="fill-green-500" />
        <path
          d="M7.5 12.5l3 3 6-6"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  info: {
    border: "border-blue-500",
    bg: "bg-blue-50",
    label: "text-blue-700",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" className="fill-blue-500" />
        <path
          d="M12 8v1M12 11v5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },

  warning: {
    border: "border-yellow-400",
    bg: "bg-yellow-50",
    label: "text-yellow-700",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3L22 20H2L12 3z"
          className="fill-yellow-400"
          strokeLinejoin="round"
        />
        <path
          d="M12 10v4M12 16.5v.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },

  error: {
    border: "border-red-500",
    bg: "bg-red-50",
    label: "text-red-700",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" className="fill-red-500" />
        <path
          d="M12 8v5M12 15.5v.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

export default function Toast({
  message,
  type,
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    if (duration <= 0) {
      return;
    }

    const timer = window.setTimeout(onClose, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [duration, onClose]);

  const { border, bg, label, icon } = config[type];

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        flex w-full max-w-sm items-center gap-3 rounded-lg border
        px-4 py-3 shadow-sm
        ${bg} ${border}
        animate-in slide-in-from-top-2 fade-in duration-200
      `}
    >
      <span className="shrink-0">{icon}</span>

      <span className={`flex-1 text-sm font-medium ${label}`}>{message}</span>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="shrink-0 cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 4l8 8M12 4l-8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
