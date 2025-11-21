import { addToCart } from "../cart/cartApi";

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

const handleAddToCart = async (product: Product) => {
  if (!product) return;

  try {
    await addToCart(product.id, 1); // ✅ Pass productId and quantity only
    alert("Added to cart!");
  } catch (err) {
    console.error(err);
    alert("Failed to add to cart");
  }
};

export default handleAddToCart;
