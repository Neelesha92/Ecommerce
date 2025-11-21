import React, { useEffect, useState } from "react";
import CartItemComponent from "./cartItem";

import { getCartItems, updateCartItem, removeCartItem } from "./cartApi";

interface CartItem {
  id: number; // Product ID
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
}

const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      console.log("Fetching cart...");
      const data = await getCartItems();
      console.log("Cart Data:", data);
      setItems(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdate = async (id: number, quantity: number) => {
    if (quantity < 1) return;

    await updateCartItem(id, quantity);
    fetchCart();
  };

  const handleRemove = async (id: number) => {
    await removeCartItem(id);
    fetchCart();
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {items.map((item) => (
            <CartItemComponent
              key={item.id}
              item={item}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          ))}

          <div className="text-right text-xl font-bold mt-6">
            Total: ${total.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
