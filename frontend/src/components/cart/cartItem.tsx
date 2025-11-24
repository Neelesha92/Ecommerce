import React from "react";

interface CartItem {
  id: number; // Product ID
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
}

interface Props {
  item: CartItem;
  onUpdate: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}

const CartItemComponent: React.FC<Props> = ({ item, onUpdate, onRemove }) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow mb-4">
      {/* Product Image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 object-cover rounded"
      />

      {/* Product Details */}
      <div className="flex-1 px-4">
        <h2 className="font-semibold text-lg">{item.name}</h2>
        <p className="text-gray-500 text-sm">{item.description}</p>
      </div>

      {/* Quantity & Price */}
      <div className="flex flex-col items-end">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdate(item.id, item.quantity - 1)}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() => onUpdate(item.id, item.quantity + 1)}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            +
          </button>
        </div>
        <p className="font-bold mt-2">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-500 text-sm mt-1 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItemComponent;
