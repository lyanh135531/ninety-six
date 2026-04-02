import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  size?: string; // Optional: for products with sizes
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isDrawerOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  setDrawerOpen: (open: boolean) => void;
}

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return { totalItems, totalPrice };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      isDrawerOpen: false,
      addItem: (item) => {
        const { items } = get();
        // Match by both ID and Size
        const existingItem = items.find((i) => i.id === item.id && i.size === item.size);
        let newItems;
        
        if (existingItem) {
          newItems = items.map((i) =>
            (i.id === item.id && i.size === item.size) 
              ? { ...i, quantity: i.quantity + item.quantity } : i
          );
        } else {
          newItems = [...items, item];
        }
        
        set({
          items: newItems,
          ...calculateTotals(newItems),
          isDrawerOpen: true, // Auto open drawer when adding item
        });
      },
      removeItem: (id, size) => {
        const newItems = get().items.filter((i) => !(i.id === id && i.size === size));
        set({
          items: newItems,
          ...calculateTotals(newItems),
        });
      },
      updateQuantity: (id, quantity, size) => {
        if (quantity <= 0) {
          get().removeItem(id, size);
          return;
        }
        
        const newItems = get().items.map((i) =>
          (i.id === id && i.size === size) ? { ...i, quantity } : i
        );
        
        set({
          items: newItems,
          ...calculateTotals(newItems),
        });
      },
      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
      setDrawerOpen: (open) => set({ isDrawerOpen: open }),
    }),
    {
      name: "mom-baby-cart",
      // Only persist items and totals, not UI state like isDrawerOpen
      partialize: (state) => ({ 
        items: state.items, 
        totalItems: state.totalItems, 
        totalPrice: state.totalPrice 
      }),
    }
  )
);
