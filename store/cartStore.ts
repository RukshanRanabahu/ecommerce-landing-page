import { create } from "zustand";
import type { CartItem } from "@/types/product";

interface CartStore {
  items: CartItem[];

  addToCart: (item: CartItem) => void;
  removeFromCart: (
    productId: string,
    selectedOption?: CartItem["selectedOption"],
  ) => void;
  increaseQuantity: (
    productId: string,
    selectedOption?: CartItem["selectedOption"],
  ) => void;
  decreaseQuantity: (
    productId: string,
    selectedOption?: CartItem["selectedOption"],
  ) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addToCart: (newItem) =>
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.selectedOption?.type === newItem.selectedOption?.type &&
          item.selectedOption?.value === newItem.selectedOption?.value,
      );

      if (existingItemIndex === -1) {
        if (newItem.quantity > newItem.stockQuantity) {
          return state;
        }
        return {
          items: [...state.items, newItem],
        };
      }

      const updatedItems = [...state.items];
      const existingItem = updatedItems[existingItemIndex];

      const newQuantity = existingItem.quantity + newItem.quantity;

      if (newQuantity > existingItem.stockQuantity) {
        return state;
      }

      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
      };

      return {
        items: updatedItems,
      };
    }),

  removeFromCart: (productId, selectedOption) =>
    set((state) => ({
      items: state.items.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.selectedOption?.type === selectedOption?.type &&
            item.selectedOption?.value === selectedOption?.value
          ),
      ),
    })),

  increaseQuantity: (productId, selectedOption) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (
          item.productId === productId &&
          item.selectedOption?.type === selectedOption?.type &&
          item.selectedOption?.value === selectedOption?.value
        ) {
          if (item.quantity >= item.stockQuantity) {
            return item;
          }

          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }

        return item;
      }),
    })),

  decreaseQuantity: (productId, selectedOption) =>
    set((state) => ({
      items: state.items
        .map((item) => {
          if (
            item.productId === productId &&
            item.selectedOption?.type === selectedOption?.type &&
            item.selectedOption?.value === selectedOption?.value
          ) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }

          return item;
        })
        .filter((item) => item.quantity > 0),
    })),
}));
