import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        textAlign: "center",
      }}
    >
      <img
        src={product.image || "https://via.placeholder.com/200"}
        alt={product.name}
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
      />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <Link to={`/product/${product.id}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
};

export default ProductCard;
