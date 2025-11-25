import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getCartItems } from "../components/cart/cartApi";
import axios, { AxiosError } from "axios";
import {
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  Truck,
  ShieldCheck,
  Loader2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

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
        "http://localhost:5000/orders",
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
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-gray-500 font-medium animate-pulse">
            Loading your cart...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Checkout
              </h1>
              <p className="mt-2 text-gray-500">
                Please provide your details to complete the purchase.
              </p>
            </div>

            {/* Contact Information */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Contact Information
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="e.g. Jane Doe"
                    value={form.name}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 border px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 border pl-10 pr-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 border pl-10 pr-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Shipping Address
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                <div className="sm:col-span-6">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="123 Main St, Apt 4B"
                    value={form.address}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 border px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    placeholder="New York"
                    value={form.city}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 border px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    placeholder="NY"
                    value={form.state}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 border px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="zip"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    id="zip"
                    placeholder="10001"
                    value={form.zip}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 border px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* Visual Placeholder for Payment */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden opacity-60 grayscale">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                <div className="p-2 bg-gray-200 rounded-lg text-gray-500">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Payment Details
                </h2>
                <span className="ml-auto text-xs font-medium bg-gray-100 text-gray-500 py-1 px-2.5 rounded-full">
                  Next Step
                </span>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Complete shipping to proceed to secure payment.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 mt-10 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-900/5 overflow-hidden sticky top-24">
              <div className="p-6 bg-gray-900 text-white flex justify-between items-center">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-400" />
                  Order Summary
                </h2>
                <span className="text-sm text-gray-400">
                  {cartItems.length} Items
                </span>
              </div>

              <div className="p-6">
                <ul className="divide-y divide-gray-100 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex py-4 gap-4 group">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3 className="line-clamp-2 leading-snug text-sm">
                            {item.name}
                          </h3>
                          <p className="ml-4 text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-xs mt-1">
                          <p className="text-gray-500">
                            Qty {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                  {cartItems.length === 0 && (
                    <li className="py-8 text-center text-gray-500 italic">
                      Your cart is empty
                    </li>
                  )}
                </ul>

                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <p>Subtotal</p>
                    <p className="font-medium text-gray-900">
                      ${total.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <p className="flex items-center gap-1">
                      Shipping <Truck className="w-3 h-3 text-gray-400" />
                    </p>
                    <p className="font-medium text-green-600">Free</p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <p className="text-base font-bold text-gray-900">Total</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      ${total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placingOrder || cartItems.length === 0}
                    className="w-full flex items-center justify-center rounded-xl border border-transparent bg-indigo-600 px-6 py-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                  >
                    {placingOrder ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Place Order <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                  <p className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" />
                    Payments are secure and encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
