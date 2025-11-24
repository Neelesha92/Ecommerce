import React, { useEffect, useState } from "react";
import CartItemComponent from "./cartItem";
import Navbar from "../Navbar";
import { getCartItems, updateCartItem, removeCartItem } from "./cartApi";
import { Link } from "react-router-dom";

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
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="flex-1">
              {items.map((item) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onUpdate={handleUpdate}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow h-fit">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Shipping</span>
                <span>$5.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total</span>
                <span>${(total + 5).toFixed(2)}</span>
              </div>
              <Link to="/checkout">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
