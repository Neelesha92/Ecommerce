import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getCartItems } from "../components/cart/cartApi";
import axios, { AxiosError } from "axios";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Checkout: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [placingOrder, setPlacingOrder] = useState(false);

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCartItems();
        setCartItems(data);
      } catch (error) {
        console.error("Failed to fetch cart items", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!form.name || !form.email || !form.address) {
      alert("Please fill all required fields");
      return;
    }

    setPlacingOrder(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/api/orders",
        {
          items: cartItems,
          total,
          shipping: form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Order placed:", response.data);
      alert("Order placed successfully!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        alert(axiosError.response?.data?.message || "Failed to place order");
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to place order");
      }
    }
  };

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Shipping Form */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="flex flex-col space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  className="border p-2 rounded flex-1"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  className="border p-2 rounded flex-1"
                />
                <input
                  type="text"
                  name="zip"
                  placeholder="ZIP"
                  value={form.zip}
                  onChange={handleChange}
                  className="border p-2 rounded flex-1"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex flex-col space-y-2 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
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
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
