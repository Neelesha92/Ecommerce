import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  Package,
  ArrowUpDown,
  MoreHorizontal,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  role?: string;
}

interface OrderItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  userId: number;
  user: User;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ================= 🔥 Fetch orders =================
  async function fetchOrders() {
    try {
      setLoading(true);
      // Determine if this is a manual refresh for UI feedback
      if (orders.length > 0) setIsRefreshing(true);

      const res = await axios.get<Order[]>(
        "http://localhost:5000/orders/admin/all",
        {
          params: { status: statusFilter, search, sort },
        }
      );

      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      // In a real app, you'd show a toast notification here
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  // Initial load
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler for "Apply Filters" (Keep existing logic, but improved UX)
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  // Helper for status badge styling
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-600/20";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-100 ring-blue-600/20";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-100 ring-amber-600/20";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100 ring-gray-600/20";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ================= Header ================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              <Package className="h-6 w-6 text-indigo-600" />
              Order Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track all customer orders in one place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm">
              <span className="font-semibold text-gray-900">
                {orders.length}
              </span>{" "}
              Total Orders
            </div>
          </div>
        </div>

        {/* ================= Filters Toolbar ================= */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <form
            onSubmit={handleApplyFilters}
            className="flex flex-col md:flex-row gap-4"
          >
            {/* Search */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search order ID or customer name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Controls Group */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Status Filter */}
              <div className="relative min-w-[160px]">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Sort */}
              <div className="relative min-w-[160px]">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <option value="latest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {loading && !isRefreshing ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                )}
                {loading && !isRefreshing ? "Searching..." : "Apply Filters"}
              </button>
            </div>
          </form>
        </div>

        {/* ================= Orders Table ================= */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
          {loading && !isRefreshing ? (
            <div className="p-12 text-center">
              <div className="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
              <p className="mt-4 text-sm text-gray-500">
                Loading order data...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No orders found
              </h3>
              <p className="mt-1 text-sm text-gray-500 max-w-sm">
                We couldn't find any orders matching your current filters. Try
                adjusting your search or status criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Order ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Total Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Created At
                    </th>
                    <th scope="col" className="relative px-6 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {orders.map((o) => (
                    <tr
                      key={o.id}
                      className="group hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          #{o.id}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs mr-3">
                            {o.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {o.user.name}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          Rs. {o.total.toLocaleString()}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ring-1 ring-inset ${getStatusColor(
                            o.status
                          )}`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {new Date(o.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(o.createdAt).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer (Visual only based on current logic) */}
          {orders.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Showing all {orders.length} results
              </span>
              <div className="flex gap-2">
                {/* Placeholder for future pagination */}
                <button
                  disabled
                  className="text-xs px-2 py-1 text-gray-400 border border-gray-200 rounded bg-white opacity-50 cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  disabled
                  className="text-xs px-2 py-1 text-gray-400 border border-gray-200 rounded bg-white opacity-50 cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
