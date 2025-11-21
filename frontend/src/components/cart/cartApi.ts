import axios from "axios";

const API_URL = "http://localhost:5000/cart";

export interface CartItem {
  id: number; // productId
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
}

// GET cart items
export const getCartItems = async (): Promise<CartItem[]> => {
  const userId = Number(localStorage.getItem("userId"));
  if (!userId) throw new Error("No userId found");

  // Define backend item type inline
  type CartItemBackend = {
    id: number;
    quantity: number;
    product: {
      id: number;
      name: string;
      price: number;
      image?: string;
      description?: string;
    };
  };

  // Tell axios what shape the response has
  const res = await axios.get<{ items: CartItemBackend[] }>(
    `${API_URL}/${userId}`
  );

  return res.data.items.map((i: CartItemBackend) => ({
    id: i.product.id,
    name: i.product.name,
    price: i.product.price,
    image: i.product.image || "",
    quantity: i.quantity,
    description: i.product.description || "",
  }));
};

// ADD to cart
export const addToCart = async (
  productId: number,
  quantity = 1
): Promise<CartItem> => {
  const userId = Number(localStorage.getItem("userId"));
  if (!userId) throw new Error("No userId found");

  const res = await axios.post(`${API_URL}/add`, {
    userId,
    productId,
    quantity,
  });

  return {
    id: res.data.productId,
    name: res.data.product.name,
    price: res.data.product.price,
    image: res.data.product.image || "",
    quantity: res.data.quantity,
    description: res.data.product.description || "",
  };
};

// UPDATE quantity
export const updateCartItem = async (
  itemId: number,
  quantity: number
): Promise<CartItem> => {
  const res = await axios.put(`${API_URL}/update`, { itemId, quantity });
  return {
    id: res.data.productId,
    name: res.data.product.name,
    price: res.data.product.price,
    image: res.data.product.image || "",
    quantity: res.data.quantity,
    description: res.data.product.description || "",
  };
};

// REMOVE item
export const removeCartItem = async (
  itemId: number
): Promise<{ message: string }> => {
  const res = await axios.delete(`${API_URL}/remove/${itemId}`);
  return res.data;
};
