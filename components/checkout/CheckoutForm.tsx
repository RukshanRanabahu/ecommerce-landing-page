"use client";

import { FormEvent, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  surname: string;
  phone: string;
  email: string;
  zipCode: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialFormData: FormData = {
  name: "",
  surname: "",
  phone: "",
  email: "",
  zipCode: "",
};

const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  const name = data.name.trim();
  const surname = data.surname.trim();
  const phone = data.phone.trim();
  const email = data.email.trim();
  const zipCode = data.zipCode.trim();

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!surname) {
    errors.surname = "Surname is required.";
  } else if (surname.length < 2) {
    errors.surname = "Surname must be at least 2 characters.";
  }

  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (!/^[+]?[0-9\s()-]{7,20}$/.test(phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!zipCode) {
    errors.zipCode = "ZIP code is required.";
  } else if (!/^[A-Za-z0-9\s-]{3,10}$/.test(zipCode)) {
    errors.zipCode = "Please enter a valid ZIP code.";
  }

  return errors;
};

export default function CheckoutForm() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);

  const clearCart = useCartStore((state) => state.clearCart);

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [errors, setErrors] = useState<FormErrors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const [success, setSuccess] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));

    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitError(null);
    setSuccess(false);

    if (items.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer: {
              name: formData.name.trim(),
              surname: formData.surname.trim(),
              phone: formData.phone.trim(),
              email: formData.email.trim(),
              zipCode: formData.zipCode.trim(),
            },
            items: items.map((item) => ({
              productId: item.productId,
              amount: item.quantity,
              ...(item.selectedOption && {
                selectedOption: item.selectedOption,
              }),
            })),
          }),
        },
      );

      const result = await response.text();

      const checkoutFailed =
        !response.ok || result.toLowerCase().includes("checkout failed");

      if (checkoutFailed) {
        throw new Error(
          "Checkout failed. Please review your details and try again.",
        );
      }
      clearCart();
      setSuccess(true);

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Checkout failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">
        Customer Information
      </h2>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Name
            </label>

            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                errors.name
                  ? "border-red-400"
                  : "border-gray-200 focus:border-gray-400"
              }`}
            />

            {errors.name && (
              <p id="name-error" className="mt-1 text-xs text-red-500">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="surname"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Surname
            </label>

            <input
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              aria-invalid={Boolean(errors.surname)}
              aria-describedby={errors.surname ? "surname-error" : undefined}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                errors.surname
                  ? "border-red-400"
                  : "border-gray-200 focus:border-gray-400"
              }`}
            />

            {errors.surname && (
              <p id="surname-error" className="mt-1 text-xs text-red-500">
                {errors.surname}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Phone
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            value={formData.phone}
            onChange={handleChange}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
              errors.phone
                ? "border-red-400"
                : "border-gray-200 focus:border-gray-400"
            }`}
          />

          {errors.phone && (
            <p id="phone-error" className="mt-1 text-xs text-red-500">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
              errors.email
                ? "border-red-400"
                : "border-gray-200 focus:border-gray-400"
            }`}
          />

          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-500">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="zipCode"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            ZIP Code
          </label>

          <input
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            aria-invalid={Boolean(errors.zipCode)}
            aria-describedby={errors.zipCode ? "zipCode-error" : undefined}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
              errors.zipCode
                ? "border-red-400"
                : "border-gray-200 focus:border-gray-400"
            }`}
          />

          {errors.zipCode && (
            <p id="zipCode-error" className="mt-1 text-xs text-red-500">
              {errors.zipCode}
            </p>
          )}
        </div>

        {submitError && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {submitError}
          </div>
        )}

        {success && (
          <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            Checkout completed successfully.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
