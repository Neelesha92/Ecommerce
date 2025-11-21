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
    <div className="flex justify-between items-center p-4 border-b rounded-lg">
      {/* Product Info */}
      <div className="flex items-center gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div>
          <h2 className="font-semibold">{item.name}</h2>
          <p className="text-gray-600">${item.price}</p>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdate(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="px-2 bg-gray-300 rounded"
        >
          -
        </button>

        <span className="px-3 font-semibold">{item.quantity}</span>

        <button
          onClick={() => onUpdate(item.id, item.quantity + 1)}
          className="px-2 bg-gray-300 rounded"
        >
          +
        </button>

        <button
          onClick={() => onRemove(item.id)}
          className="ml-4 px-3 py-1 bg-red-500 text-white rounded"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItemComponent;
