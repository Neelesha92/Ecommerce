import { Link } from "react-router-dom";
import { ShoppingCart, Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

const Navbar: React.FC = () => {
  const { getTotalQuantity } = useCart();
  const { isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const cartCount = getTotalQuantity();
  const [searchTerm, setSearchTerm] = useState<string>(""); // Add this
  const navigate = useNavigate();

  const handlesearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search/${searchTerm}`);
      setSearchTerm("");
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo + Search */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-white font-bold">
                MM
              </div>
              <span className="text-lg font-semibold text-gray-800">
                MegaMart
              </span>
            </Link>

            {/* Search - hidden on small screens */}
            <div className="hidden md:block">
              <form
                onSubmit={handlesearch}
                className="flex items-center bg-gray-100 rounded-md overflow-hidden"
              >
                <input
                  type="search"
                  placeholder="Search products, categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 w-72 bg-transparent outline-none text-sm"
                />
                <button
                  type="submit"
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Center: Nav links (hidden on small screens) */}
          <nav className="hidden lg:flex gap-6 items-center text-gray-700">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <Link to="/products-page" className="hover:text-primary">
              Shop
            </Link>
            <Link to="/categories" className="hover:text-primary">
              Categories
            </Link>
            <Link to="/about" className="hover:text-primary">
              About
            </Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Login/Sign up - hidden on small screens */}
            <div className="hidden md:flex items-center gap-3">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className="text-sm px-3 py-1 hover:text-primary"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm bg-primary px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="text-sm px-3 py-1 rounded hover:text-primary"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm px-3 py-1 rounded hover:text-red-600"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Cart icon */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="block lg:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden mt-3 pb-4 border-t">
            <div className="flex flex-col gap-2 px-1">
              <Link to="/" className="px-2 py-2 rounded hover:bg-gray-100">
                Home
              </Link>
              <Link
                to="/products"
                className="px-2 py-2 rounded hover:bg-gray-100"
              >
                Shop
              </Link>
              <Link
                to="/categories"
                className="px-2 py-2 rounded hover:bg-gray-100"
              >
                Categories
              </Link>
              <Link to="/about" className="px-2 py-2 rounded hover:bg-gray-100">
                About
              </Link>
              <Link to="/login" className="px-2 py-2 rounded hover:bg-gray-100">
                Login
              </Link>
              <Link
                to="/register"
                className="px-2 py-2 rounded bg-primary text-white text-center"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
