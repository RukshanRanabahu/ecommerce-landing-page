import type { Brand, Category, Product, Option } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
}

export async function getBrands(): Promise<Brand[]> {
  const response = await fetch(`${API_URL}/brands`);

  if (!response.ok) {
    throw new Error("Failed to fetch brands");
  }

  return response.json();
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}

export async function getOptions(): Promise<Option[]> {
  const response = await fetch(`${API_URL}/options`);

  if (!response.ok) {
    throw new Error("Failed to fetch options");
  }

  return response.json();
}