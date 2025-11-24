import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// Define the type for one cart item
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Define the context type
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  getTotalQuantity: () => number;
}

// Create the context with undefined as default
const CartContext = createContext<CartContextType | undefined>(undefined);

// ✅ Named export: React component provider
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  // Save cart in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const exist = prev.find((i) => i.id === item.id);
      if (exist) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        return [...prev, item];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, getTotalQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ Default export: context itself
export default CartContext;
