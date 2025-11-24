import { useEffect, useState } from "react";
import api from "../api";
import AddressForm from "./AddressForm";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export type Address = {
  id: number;
  label?: string;
  recipient: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  isDefault: boolean;
};

export default function AddressList() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editing, setEditing] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/user/addresses");
      setAddresses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await api.delete(`/user/addresses/${id}`);
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await api.patch(`/user/addresses/${id}/default`);
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto py-10 px-5">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">
              My Addresses
            </h2>
            <p className="text-gray-500 text-sm">
              Manage your saved delivery locations
            </p>
          </div>

          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            + Add Address
          </button>
        </div>

        {/* NO ADDRESSES */}
        {addresses.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
            No addresses added yet.
          </div>
        )}

        {/* ADDRESS CARDS */}
        <div className="space-y-5">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-3">
                {/* LEFT SECTION */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {addr.label || "Address"}
                  </h3>

                  <p className="text-gray-700 mt-1">
                    <span className="font-medium">{addr.recipient}</span> •{" "}
                    {addr.phone || "-"}
                  </p>

                  <p className="text-gray-600 mt-1 leading-relaxed">
                    {addr.line1}
                    {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}
                    {addr.state ? `, ${addr.state}` : ""}
                    {addr.postalCode ? ` - ${addr.postalCode}` : ""},{" "}
                    {addr.country}
                  </p>

                  {/* DEFAULT BADGE */}
                  {addr.isDefault && (
                    <span className="inline-block mt-3 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                      Default Address
                    </span>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col items-end gap-2 text-sm">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-blue-600 hover:underline"
                    >
                      Set Default
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setEditing(addr);
                      setShowForm(true);
                    }}
                    className="text-green-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* POPUP FORM */}
        {showForm && (
          <AddressForm
            initial={editing}
            onClose={() => {
              setShowForm(false);
              fetchAddresses();
            }}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
