export type ProductOptionValue = string | number;

export interface SelectibleOption {
  option_type: string;
  option_name: string;
  option: ProductOptionValue[];
}

export interface Product {
  id: string;
  product_name: string;
  category: string;
  price: number;
  brand: string;
  stock_quantity: number;
  release_date: string;
  description: string;
  selectible_option: SelectibleOption | null;
}

export interface Brand {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Option {
  option_type: string;
  option_name: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  stockQuantity: number;
  selectedOption?: {
    type: string;
    value: string | number;
    label: string;
  };
  image?: string;
  brand: string;
}
