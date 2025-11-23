import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../api";
import type { Address } from "./AddressList";

type Props = {
  initial?: Address | null;
  onClose: () => void;
};

export default function AddressForm({ initial, onClose }: Props) {
  const { register, handleSubmit, reset } = useForm<Address>({
    defaultValues: initial || {
      label: "",
      recipient: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Nepal",
      isDefault: false,
    },
  });

  useEffect(() => {
    if (initial) {
      // Cast initial to the same type as useForm defaultValues
      reset({
        label: initial.label || "",
        recipient: initial.recipient,
        phone: initial.phone || "",
        line1: initial.line1,
        line2: initial.line2 || "",
        city: initial.city,
        state: initial.state || "",
        postalCode: initial.postalCode || "",
        country: initial.country,
        isDefault: initial.isDefault || false,
      });
    }
  }, [initial, reset]);

  const onSubmit = async (data: Address) => {
    try {
      if (initial) {
        await api.put(`/user/addresses/${initial.id}`, data);
        alert("Address updated!");
      } else {
        await api.post("/user/addresses", data);
        alert("Address added!");
      }
      onClose();
    } catch (err) {
      // Type-safe way to get axios error message
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Failed to save address");
      }
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-3">
          {initial ? "Edit Address" : "Add Address"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <input
            className="input w-full"
            placeholder="Label (Home, Work)"
            {...register("label")}
          />
          <input
            className="input w-full"
            placeholder="Recipient name"
            {...register("recipient", { required: true })}
          />
          <input
            className="input w-full"
            placeholder="Phone"
            {...register("phone")}
          />
          <input
            className="input w-full"
            placeholder="Line 1 (street)"
            {...register("line1", { required: true })}
          />
          <input
            className="input w-full"
            placeholder="Line 2 (apt)"
            {...register("line2")}
          />
          <input
            className="input w-full"
            placeholder="City"
            {...register("city", { required: true })}
          />
          <input
            className="input w-full"
            placeholder="State"
            {...register("state")}
          />
          <input
            className="input w-full"
            placeholder="Postal Code"
            {...register("postalCode")}
          />
          <input
            className="input w-full"
            placeholder="Country"
            {...register("country", { required: true })}
          />
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("isDefault")} id="isDefault" />
            <label htmlFor="isDefault">Set as default</label>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initial ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
