// import { create } from "zustand";
// import type { CartItem } from "@/types/product";

// interface CartStore {
//   items: CartItem[];

//   addToCart: (item: CartItem) => void;
//   removeFromCart: (
//     productId: string,
//     selectedOption?: CartItem["selectedOption"],
//   ) => void;
//   increaseQuantity: (
//     productId: string,
//     selectedOption?: CartItem["selectedOption"],
//   ) => void;
//   decreaseQuantity: (
//     productId: string,
//     selectedOption?: CartItem["selectedOption"],
//   ) => void;
// }

// export const useCartStore = create<CartStore>((set) => ({
//   items: [],

//   addToCart: (newItem) =>
//     set((state) => {
//       const existingItemIndex = state.items.findIndex(
//         (item) =>
//           item.productId === newItem.productId &&
//           item.selectedOption?.type === newItem.selectedOption?.type &&
//           item.selectedOption?.value === newItem.selectedOption?.value,
//       );

//       if (existingItemIndex === -1) {
//         if (newItem.quantity > newItem.stockQuantity) {
//           return state;
//         }
//         return {
//           items: [...state.items, newItem],
//         };
//       }

//       const updatedItems = [...state.items];
//       const existingItem = updatedItems[existingItemIndex];

//       const newQuantity = existingItem.quantity + newItem.quantity;

//       if (newQuantity > existingItem.stockQuantity) {
//         return state;
//       }

//       updatedItems[existingItemIndex] = {
//         ...existingItem,
//         quantity: newQuantity,
//       };

//       return {
//         items: updatedItems,
//       };
//     }),

//   removeFromCart: (productId, selectedOption) =>
//     set((state) => ({
//       items: state.items.filter(
//         (item) =>
//           !(
//             item.productId === productId &&
//             item.selectedOption?.type === selectedOption?.type &&
//             item.selectedOption?.value === selectedOption?.value
//           ),
//       ),
//     })),

//   increaseQuantity: (productId, selectedOption) =>
//     set((state) => ({
//       items: state.items.map((item) => {
//         if (
//           item.productId === productId &&
//           item.selectedOption?.type === selectedOption?.type &&
//           item.selectedOption?.value === selectedOption?.value
//         ) {
//           if (item.quantity >= item.stockQuantity) {
//             return item;
//           }

//           return {
//             ...item,
//             quantity: item.quantity + 1,
//           };
//         }

//         return item;
//       }),
//     })),

//   decreaseQuantity: (productId, selectedOption) =>
//     set((state) => ({
//       items: state.items
//         .map((item) => {
//           if (
//             item.productId === productId &&
//             item.selectedOption?.type === selectedOption?.type &&
//             item.selectedOption?.value === selectedOption?.value
//           ) {
//             return {
//               ...item,
//               quantity: item.quantity - 1,
//             };
//           }

//           return item;
//         })
//         .filter((item) => item.quantity > 0),
//     })),
// }));

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/product";

interface CartStore {
  items: CartItem[];

  addToCart: (item: CartItem) => boolean;
  removeFromCart: (
    productId: string,
    selectedOption?: CartItem["selectedOption"],
  ) => void;
  increaseQuantity: (
    productId: string,
    selectedOption?: CartItem["selectedOption"],
  ) => boolean;
  decreaseQuantity: (
    productId: string,
    selectedOption?: CartItem["selectedOption"],
  ) => void;
}

const isSameCartItem = (
  item: CartItem,
  productId: string,
  selectedOption?: CartItem["selectedOption"],
) => {
  return (
    item.productId === productId &&
    item.selectedOption?.type === selectedOption?.type &&
    item.selectedOption?.value === selectedOption?.value
  );
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addToCart: (newItem) => {
        let added = false;

        set((state) => {
          const productQuantityInCart = state.items
            .filter((item) => item.productId === newItem.productId)
            .reduce((total, item) => total + item.quantity, 0);

          const requestedQuantity = productQuantityInCart + newItem.quantity;

          if (requestedQuantity > newItem.stockQuantity) {
            return state;
          }

          const existingItemIndex = state.items.findIndex((item) =>
            isSameCartItem(item, newItem.productId, newItem.selectedOption),
          );

          if (existingItemIndex === -1) {
            added = true;

            return {
              items: [...state.items, newItem],
            };
          }

          const updatedItems = [...state.items];

          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity:
              updatedItems[existingItemIndex].quantity + newItem.quantity,
          };

          added = true;

          return {
            items: updatedItems,
          };
        });

        return added;
      },

      removeFromCart: (productId, selectedOption) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !isSameCartItem(item, productId, selectedOption),
          ),
        })),

      increaseQuantity: (productId, selectedOption) => {
        let increased = false;

        set((state) => {
          const item = state.items.find((cartItem) =>
            isSameCartItem(cartItem, productId, selectedOption),
          );

          if (!item) {
            return state;
          }

          const productQuantityInCart = state.items
            .filter((cartItem) => cartItem.productId === productId)
            .reduce((total, cartItem) => total + cartItem.quantity, 0);

          if (productQuantityInCart >= item.stockQuantity) {
            return state;
          }

          increased = true;

          return {
            items: state.items.map((cartItem) =>
              isSameCartItem(cartItem, productId, selectedOption)
                ? {
                    ...cartItem,
                    quantity: cartItem.quantity + 1,
                  }
                : cartItem,
            ),
          };
        });

        return increased;
      },

      decreaseQuantity: (productId, selectedOption) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              isSameCartItem(item, productId, selectedOption)
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                  }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),
    }),
    {
      name: "frt-cart",
    },
  ),
);
