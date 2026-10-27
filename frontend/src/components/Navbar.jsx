import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "./API/API";

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  // Mobile Hamburger Menu State toggle
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Cart count
  const [cartCount, setCartCount] = useState(0);
  const [cartStoreName, setCartStoreName] = useState("");

  useEffect(() => {
    const syncCart = () => {
      let activeCart = [];
      let activeStoreName = "";

      for (let index = 0; index < window.localStorage.length; index += 1) {
        const key = window.localStorage.key(index);

        if (!key?.startsWith("jhankoo_cart_")) {
          continue;
        }

        try {
          const savedCart = JSON.parse(window.localStorage.getItem(key) || "[]");

          if (Array.isArray(savedCart) && savedCart.length > 0) {
            activeCart = savedCart;
            activeStoreName = savedCart[0]?.storeName || "";
            break;
          }
        } catch (error) {
          console.error("Error reading navbar cart:", error);
        }
      }

      setCartCount(activeCart.reduce((total, item) => total + Number(item.quantity || 0), 0));
      setCartStoreName(activeStoreName);
    };

    syncCart();
    window.addEventListener("jhankoo-shopping-updated", syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("jhankoo-shopping-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  // Scroll monitoring hook logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 20 || currentScrollY < lastScrollY.current) {
        setIsNavbarVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsNavbarVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active route checker
  const isActive = (path) => {
    return window.location.pathname === path;
  };

  // Logout Handler
  const logoutHandler = async () => {
    try {
      const response = await API.post("/api/auth/logout");

      if (response.status === 200) {
        toast.success("Logged out successfully!");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.log("Logout error:", error);

      toast.error(error?.response?.data?.message || "Logout completed locally.");
    } finally {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setIsOpen(false);
      navigate("/");
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 bg-creator-bg hover:bg-creator-bg-butter backdrop-blur-md transition-transform duration-500 ease-in-out ${isNavbarVisible || isOpen ? "translate-y-0" : "-translate-y-full"} border-b border-transparent`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-15 items-center justify-between">
          {/* LEFT: Branding Section */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <span className="font-caveat text-2xl font-black tracking-tight text-creator-text ">Jhankoo</span>
          </div>

          {/* CENTER: Desktop Links Matrix */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {/* Home */}
            <span onClick={() => navigate("/")} className={`cursor-pointer hover:text-creator-text transition-colors duration-150 text-creator-text/70 ${isActive("/") ? "text-creator-text" : ""}`}>
              Home
            </span>

            {/* Explore */}
            {/* <span
              onClick={() => navigate("/explore")}
              className={`cursor-pointer hover:text-creator-text transition-colors duration-150 text-creator-text/70 ${ isActive("/explore") ? "text-creator-text" : "" }`}
            >
              Explore
            </span> */}

            {/* Seller Controls Context Injector Links */}
            {isLoggedIn && (
              <>
                {/* Dashboard */}
                <button
                  onClick={() => navigate("/products")}
                  className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 hover:bg-emerald-100 transition shadow-sm active:scale-95 font-sans normal-case text-xs cursor-pointer"
                >
                  🎛️ Products
                </button>

                {/* Store Settings */}
                <button
                  onClick={() => navigate("/store/settings")}
                  className={`hover:text-creator-text transition-colors cursor-pointer ${isActive("/dashboard/settings") ? "text-creator-text" : ""}`}
                >
                  Store Settings
                </button>
              </>
            )}

            {/* Our Story */}
            <Link to="/our-story" className="text-creator-text/70 hover:text-creator-primary transition-colors duration-150">
              Our Story
            </Link>
          </div>

          {/* RIGHT: User Actions & Utilities */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Interactive Dynamic Cart Widget */}
            {/* <button
              onClick={() => navigate("/cart")}
              className="relative rounded-full border border-creator-text/10 p-2 text-creator-text hover:bg-creator-bg transition-all active:scale-95"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-creator-accent text-[10px] font-bold text-white shadow-sm ring-2 ring-creator-bg-butter animate-bounce-short">
                  {cartCount}
                </span>
              )}
            </button> */}

            {/* Account CTA Conditional Switch */}
            {isLoggedIn ? (
              <button onClick={logoutHandler} className="rounded-full bg-red-500 px-5 py-2 text-xs font-caveat text-white shadow-sm hover:bg-opacity-95 transition-all cursor-pointer active:scale-95 cursor-pointer">
                Logout
              </button>
            ) : (
              <button onClick={() => navigate("/auth")} className="rounded-full bg-creator-text px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-creator-primary transition-all cursor-pointer">
                Login / Register
              </button>
            )}
          </div>

          {/* MOBILE INTERACTION ROW */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Mobile Cart Counter Icon */}
            {/* <button
              onClick={() => navigate(cartStoreName ? `/publicstore/${encodeURIComponent(cartStoreName)}/cart` : "/cart")}
              className="relative rounded-full border border-creator-text/10 p-2 text-creator-text"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>

              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-creator-accent text-[9px] font-bold text-white">{cartCount}</span>
              )}
            </button> */}

            {/* Hamburger Trigger Engine */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2 text-creator-text hover:bg-creator-bg focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>

              {isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE COLLAPSIBLE PANEL OVERLAY */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[32rem] opacity-100 border-t border-creator-text/5 bg-creator-bg-butter" : "max-h-0 opacity-0 pointer-events-none"}`}
        id="mobile-menu"
      >
        <div className="space-y-1 px-4 py-3">
          <span
            onClick={() => {
              setIsOpen(false);
              navigate("/");
            }}
            className="block rounded-xl px-3 py-2.5 text-base font-medium text-creator-text/80 hover:bg-creator-bg hover:text-creator-text transition-all cursor-pointer"
          >
            Home
          </span>
         
          <span
            onClick={() => {
              setIsOpen(false);
              navigate("/our-story");
            }}
            className="block rounded-xl px-3 py-2.5 text-base font-medium text-creator-text/80 hover:bg-creator-bg hover:text-creator-text transition-all cursor-pointer"
          >
            Our story
          </span> 

          {isLoggedIn && (
            <>
              <span
                onClick={() => {
                  setIsOpen(false);
                  navigate("/dashboard");
                }}
                className="block rounded-xl px-3 py-2.5 text-base font-medium text-creator-text/80 hover:bg-creator-bg hover:text-creator-text transition-all"
              >
                Dashboard
              </span>
              <span
                onClick={() => {
                  setIsOpen(false);
                  navigate("/dashboard/settings");
                }}
                className="block rounded-xl px-3 py-2.5 text-base font-medium text-creator-text/80 hover:bg-creator-bg hover:text-creator-text transition-all"
              >
                Store Settings
              </span>
            </>
          )}
          <div className="pt-2 mt-2 border-t border-creator-text/5">
            {/* MOBILE ACCOUNT BUTTON */}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  logoutHandler();
                }}
                className="w-full text-center rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-creator-primary transition-all"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/auth");
                }}
                className="w-full text-center rounded-xl bg-creator-text py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-creator-primary transition-all"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
