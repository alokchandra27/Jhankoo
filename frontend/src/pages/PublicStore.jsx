import React, { useEffect, useRef, useState } from "react";
import bannerImg from "../assets/banner.webp";
import instagramImg from "../assets/instagram.webp";
import facebookImg from "../assets/facebook.webp";
import whatsappImg from "../assets/whatsapp.webp";
import redcolorImg from "../assets/redcolor.webp";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Heart, Home, MessageCircle, Package, Share2, ShoppingCart, Sparkles, Users, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../components/API/API";

import { addToCartStorage, getCart, getWishlist, toggleWishlistStorage } from "../utils/storeStorage";
import AboutStore from "./AboutStore";
import Footer from "./Footer";

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// IMAGE HELPER
// ============================================================

const getImageUrl = (image, fallback = "") => {
  if (!image) return fallback;

  if (typeof image === "string") {
    return image;
  }

  return image?.url || fallback;
};

// ============================================================
// PRODUCT CARD
// ============================================================

const ProductCard = ({ product, productIndex, navigate, addToCart, toggleWishlist, isWishlisted }) => {
  const images = [getImageUrl(product?.productImage1), getImageUrl(product?.productImage2), getImageUrl(product?.productImage3), getImageUrl(product?.productImage4)].filter(Boolean);

  const [activeImage, setActiveImage] = useState(0);

  const touchStartX = useRef(0);
  const isSwiping = useRef(false);





  const productPrice = Math.max(0, Number(product?.productPrice) || 0);
  /*
  const shippingCost = Math.max(0, Number(product?.shippingCost) || 0);

  const shippingAvailable = product?.shippingAvailable === true;
  const shippingIncluded = product?.shippingIncluded === true;
  */

  const totalPrice = productPrice;

  const formatPrice = (price) =>
    `₹${Number(price).toLocaleString("en-IN")}`;







  const nextImage = (event) => {
    event?.stopPropagation();

    if (images.length <= 1) return;

    setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const previousImage = (event) => {
    event?.stopPropagation();

    if (images.length <= 1) return;

    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleTouchStart = (event) => {
    event.stopPropagation();

    touchStartX.current = event.touches[0].clientX;
    isSwiping.current = false;
  };

  const handleTouchMove = (event) => {
    const currentX = event.touches[0].clientX;

    if (Math.abs(currentX - touchStartX.current) > 12) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = (event) => {
    event.stopPropagation();

    const endX = event.changedTouches[0].clientX;
    const difference = touchStartX.current - endX;

    if (Math.abs(difference) < 45) {
      return;
    }

    if (difference > 0) {
      setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else {
      setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const openProduct = () => {
    if (isSwiping.current) {
      isSwiping.current = false;
      return;
    }

    navigate(`/productDetails/${product._id}`);
  };

  const isOutOfStock = product?.stocks !== undefined && product?.stocks !== null && Number(product.stocks) <= 0;

  return (
  <article
      onClick={openProduct}
      className="publicstore-product-card group relative cursor-pointer overflow-hidden rounded-xl border border-creator-primary/15 bg-white shadow-[0_4px_16px_rgba(95,111,101,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-creator-accent/60 hover:shadow-[0_14px_28px_rgba(95,111,101,0.16)]"
    >
      {/* PRODUCT IMAGE */}

      <div
        className="relative aspect-square overflow-hidden bg-creator-bg-butter touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${activeImage * 100}%)`,
          }}
        >
          {images.length > 0 ? (
            images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="h-full w-full shrink-0"
              >
                <img
                  src={image}
                  alt={`${product?.productName || "Product"} ${index + 1}`}
                  loading={productIndex < 2 && index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  draggable="false"
                  className="h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
            ))
          ) : (
            <div className="flex h-full w-full shrink-0 items-center justify-center">
              <Package size={34} className="text-creator-text/30" />
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* WISHLIST */}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Save product"}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-creator-text shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-90"
        >
          <Heart
            size={15}
            fill={isWishlisted ? "currentColor" : "none"}
            className={isWishlisted ? "text-creator-pink" : "text-creator-text"}
          />
        </button>

        {/* CUSTOMIZABLE */}

        {product?.customization && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-creator-accent/90 px-2 py-1 text-[8px] font-semibold uppercase tracking-wide text-creator-text shadow-sm backdrop-blur">
            Customizable
          </span>
        )}

        {/* IMAGE COUNT */}

        {images.length > 1 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[9px] font-medium text-white backdrop-blur">
            {activeImage + 1}/{images.length}
          </span>
        )}

        {/* IMAGE NAVIGATION */}

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={previousImage}
              className="absolute left-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all hover:scale-110 sm:flex sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronLeft size={15} />
            </button>

            <button
              type="button"
              aria-label="Next image"
              onClick={nextImage}
              className="absolute right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all hover:scale-110 sm:flex sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronRight size={15} />
            </button>
          </>
        )}

        {/* IMAGE DOTS */}

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
            {images.map((_, index) => (
              <button
                type="button"
                key={index}
                aria-label={`View image ${index + 1}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveImage(index);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeImage === index
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

{/* PRODUCT INFORMATION */}

<div className="p-3">
  {/* CATEGORY */}
  <div className="flex items-center justify-between gap-2">
    <span className="truncate text-[10px] font-medium text-creator-primary">
      {product?.category || "Handmade"}
    </span>

    {product?.size && (
      <span className="shrink-0 text-[10px] text-creator-text/50">
        {product.size}
      </span>
    )}
  </div>

  {/* PRODUCT NAME */}
  <h3 className="mt-1 truncate text-sm font-semibold text-creator-text">
    {product?.productName}
  </h3>

  {/* PRICE */}
  <div className="mt-2 flex items-end justify-between gap-2">
    <div className="min-w-0">
      <p className="text-[10px] text-creator-text/50">
        Price
      </p>

      <strong className="text-lg font-semibold leading-tight text-creator-text">
        {formatPrice(totalPrice)}
      </strong>
    </div>

    {/* Shipping display is temporarily disabled. */}
  </div>

  {/* DESCRIPTION */}
  <p className="mt-1.5 line-clamp-2 text-[11px] leading-4 text-creator-text/55">
    {product?.productDescription || "Handmade with care and love."}
  </p>

  {/* ADD TO CART */}
  <button
    type="button"
    disabled={isOutOfStock}
    onClick={(event) => {
      event.stopPropagation();

      if (!isOutOfStock) {
        addToCart(product);
      }
    }}
    className={`mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg text-xs font-medium transition-colors ${
      isOutOfStock
        ? "cursor-not-allowed bg-neutral-100 text-neutral-400"
        : "bg-creator-primary text-white hover:bg-creator-text"
    }`}
  >
    <ShoppingCart size={14} />
    {isOutOfStock ? "Out of stock" : "Add to cart"}
  </button>

  {/* STOCK */}
  {product?.stocks !== undefined && product?.stocks !== null && (
    <p
      className={`mt-2 text-center text-[10px] ${
        isOutOfStock ? "text-red-500" : "text-creator-text/45"
      }`}
    >
      {isOutOfStock
        ? "Currently unavailable"
        : `${product.stocks} available`}
    </p>
  )}
</div>

    </article>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const PublicStore = () => {
  const { storeName } = useParams();
  const validStoreName = typeof storeName === "string" && storeName.trim() && storeName !== "undefined" && storeName !== "null" ? storeName.trim() : null;

  const navigate = useNavigate();
  const pageRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState("All");

  const [cartCount, setCartCount] = useState(0);
  const [wishlistIds, setWishlistIds] = useState([]);

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // CATEGORIES
  // Keep all categories because user can click and see
  // "No Resin products available"
  // ==========================================================

  const categories = ["All", "Clay", "Resin", "Wood", "Metal", "Fabric", "Crochet", "3D Printing", "Handmade", "Other"];

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredProducts = activeCategory === "All" ? products : products.filter((product) => product.category?.toLowerCase() === activeCategory.toLowerCase());

  useGSAP(
    () => {
      const sections = [
        { selector: ".publicstore-hero", x: -55, y: 0 },
        { selector: ".publicstore-profile", x: 55, y: 0 },
        { selector: ".publicstore-collection", x: -45, y: 25 },
        { selector: ".publicstore-empty", x: 45, y: 25 },
        { selector: ".publicstore-products", x: -45, y: 25 },
        { selector: ".publicstore-cta", x: 45, y: 25 },
        { selector: ".publicstore-footer", x: 0, y: 35 },
      ];

      sections.forEach(({ selector, x, y }) => {
        const element = document.querySelector(selector);
        if (!element) return;

        gsap.from(element, {
          x,
          y,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 82%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      });

      const productCards = gsap.utils.toArray(".publicstore-product-card");

      productCards.forEach((card, index) => {
        gsap.from(card, {
          y: 35,
          opacity: 0,
          duration: 0.55,
          delay: (index % 4) * 0.04,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      });
    },
    { scope: pageRef.current || undefined, dependencies: [loading] },
  );

  // ==========================================================
  // CART
  // ==========================================================

  // const addToCart = () => {
  //   setCartCount((prev) => prev + 1);
  // };

  const addToCart = (product) => {
    const cart = addToCartStorage(validStoreName, {
      ...product,

      whatsappNumber: store?.whatsappNumber || "",

      instagramUsername: store?.instagramUsername || "",

      instagramLink: store?.instagramLink || "",
    });

    setCartCount(cart.reduce((total, item) => total + Number(item.quantity || 0), 0));
    window.dispatchEvent(new Event("jhankoo-shopping-updated"));
    toast.success(`${product?.productName || "Product"} added to cart`, {
      autoClose: 1800,
    });
  };

  const toggleWishlist = (product) => {
    if (!validStoreName || !product?._id) return;

    const wasWishlisted = wishlistIds.includes(product._id);
    const result = toggleWishlistStorage(validStoreName, product);
    const nextWishlist = Array.isArray(result?.wishlist) ? result.wishlist : getWishlist(validStoreName);

    setWishlistIds(nextWishlist.map((item) => item.productId || item._id));
    window.dispatchEvent(new Event("jhankoo-shopping-updated"));
    toast.success(wasWishlisted ? "Removed from wishlist" : "Added to wishlist", {
      autoClose: 1800,
    });
  };
  // ==========================================================
  // FETCH STORE
  // ==========================================================

  const fetchStoreData = async () => {
    if (!validStoreName) {
      setLoading(false);
      setError("This store link is invalid.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await API.get(`/api/shop/${encodeURIComponent(validStoreName)}`);

      setStore(response.data.store);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching store data:", error);

      setError(error?.response?.data?.message || "This store could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, [validStoreName]);

  useEffect(() => {
    if (!validStoreName) return;

    const syncShopping = () => {
      const cart = getCart(validStoreName);
      const wishlist = getWishlist(validStoreName);

      setCartCount(cart.reduce((total, item) => total + Number(item.quantity || 0), 0));
      setWishlistIds(wishlist.map((item) => item.productId || item._id));
    };

    syncShopping();

    window.addEventListener("jhankoo-shopping-updated", syncShopping);

    return () => {
      window.removeEventListener("jhankoo-shopping-updated", syncShopping);
    };
  }, [validStoreName]);
  // ==========================================================
  // SOCIAL
  // ==========================================================

  const openInstagram = () => {
    if (!store?.instagramLink) return;

    window.open(store.instagramLink, "_blank", "noopener,noreferrer");
  };

  const openFacebook = () => {
    if (!store?.facebookLink) return;

    window.open(store.facebookLink, "_blank", "noopener,noreferrer");
  };

  const openWhatsApp = () => {
    if (!store?.whatsappNumber) return;

    const number = String(store.whatsappNumber).replace(/\D/g, "");

    const message = encodeURIComponent(`Hi! I found ${store?.storeName || "your store"} on Jhankoo and would love to know more about your products. ✨`);

    window.open(`https://wa.me/${number}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  // ==========================================================
  // SHARE
  // ==========================================================

  const shareStore = async () => {
    const currentUrl = window.location.href;

    const storeTitle = store?.storeName ? `${store.storeName} on Jhankoo` : "Check out this store on Jhankoo";

    if (navigator.share) {
      try {
        await navigator.share({
          title: storeTitle,
          text: "Explore this creator store on Jhankoo ✨",
          url: currentUrl,
        });
      } catch (error) {
        console.log("Sharing cancelled.");
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl);

        alert("Store link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy link:", error);
      }
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-creator-bg-butter px-4 py-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-[390px] rounded-[28px] bg-white/60" />

          <div className="mt-8 flex gap-5">
            <div className="h-28 w-28 rounded-full bg-white/60" />

            <div className="flex-1 pt-3">
              <div className="h-7 w-48 rounded bg-white/60" />

              <div className="mt-4 h-4 max-w-md rounded bg-white/60" />

              <div className="mt-3 h-4 max-w-sm rounded bg-white/60" />
            </div>
          </div>

          <div className="mt-12 h-8 w-60 rounded bg-white/60" />

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="overflow-hidden rounded-2xl bg-white/60">
                <div className="aspect-square bg-white/50" />

                <div className="p-4">
                  <div className="h-4 rounded bg-white/50" />

                  <div className="mt-3 h-4 w-2/3 rounded bg-white/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-creator-bg-butter px-5">
        <div className="w-full max-w-md rounded-[28px] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <X size={24} />
          </div>

          <h1 className="mt-5 font-serif text-2xl font-semibold">Store unavailable</h1>

          <p className="mt-3 text-sm leading-6 text-creator-text/55">{error}</p>

          <button onClick={() => navigate("/")} className="mt-7 rounded-full bg-creator-text px-6 py-3 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg">
            Back to Jhankoo
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN
  // ==========================================================

  return (
    <div ref={pageRef} className="min-h-screen overflow-x-hidden bg-creator-bg-butter text-creator-text mt-10">
      {/* ===================================================== */}
      {/* MAIN */}
      {/* ===================================================== */}

      <main className="mx-auto w-[calc(100%-24px)] max-w-6xl px-1 pb-20 sm:w-[calc(100%-48px)] lg:px-0">
        {/* ================================================= */}
        {/* HERO */}
        {/* ================================================= */}

        <section className="publicstore-hero relative grid overflow-hidden rounded-[28px] bg-creator-bg shadow-[0_18px_55px_rgba(82,60,42,0.08)] lg:grid-cols-[0.86fr_1.14fr]">
          {/* DECORATIVE BRUSH */}

          <div className="pointer-events-none absolute -left-7 top-16 h-10 w-28 rotate-[-12deg] rounded-full bg-creator-pink/20 blur-[1px]" />

          {/* HERO TEXT */}

          <div className="relative z-10 flex min-h-[350px] flex-col justify-center gap-2 px-7 py-10 sm:px-12 lg:min-h-[440px] lg:px-14">
            {/* handwritten mini label */}

            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-creator-pink" />

              <span className="font-caveat text-lg text-creator-text/70">a little handmade world</span>
            </div>

            <h1 className="max-w-md font-caveat text-5xl font-normal leading-[0.9] text-creator-text sm:text-7xl">
              Made by hand,
              <span className="block text-creator-pink">made for you.</span>
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-6 text-creator-text/60 sm:text-base">
              Discover thoughtful pieces from <span className="font-semibold underline decoration-creator-pink decoration-2 underline-offset-4">{store?.storeName || "a small creator"}</span>, made
              slowly and shared with love.
            </p>

            <a
              href="#collection"
              className="group mt-7 flex w-fit items-center gap-2 rounded-full bg-creator-pink px-5 py-3 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:rotate-[-1deg] hover:shadow-lg active:scale-95"
            >
              Explore the collection
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {/* HERO IMAGE */}

          <div className="relative min-h-[270px] overflow-hidden lg:min-h-[440px]">
            <img
              src={getImageUrl(store?.bannerImage, bannerImg)}
              alt="Store banner"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.035]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

            {/* taped-note feeling */}

            <div className="absolute bottom-7 left-7 rotate-[-4deg] bg-white/90 px-4 py-2 font-caveat text-sm shadow-sm backdrop-blur transition-transform duration-300 hover:rotate-2">
              handmade
              <br />
              with love ♡
            </div>

            <span className="absolute bottom-5 right-5 rotate-[2deg] rounded-full bg-white/90 px-3 py-2 font-caveat text-sm font-semibold text-creator-text shadow-sm transition-all duration-300 hover:-rotate-3 hover:scale-105">
              small business · big heart
            </span>
          </div>
        </section>

        {/* ================================================= */}
        {/* STORE PROFILE */}
        {/* ================================================= */}

        <section className="publicstore-profile relative flex flex-col gap-5 border-b border-creator-text/10 px-2 py-8 md:flex-row md:gap-7 md:py-10">
          {/* small decorative heart */}

          <span className="absolute right-2 top-4 rotate-12 font-caveat text-xl text-creator-pink md:right-5">♡</span>

          {/* LOGO */}

          <div className="mx-auto h-[115px] w-[115px] shrink-0 rotate-[-2deg] overflow-hidden rounded-full border-[6px] border-white bg-creator-accent shadow-sm transition-all duration-500 hover:rotate-3 hover:scale-105 sm:h-[135px] sm:w-[135px] md:mx-0 md:h-[145px] md:w-[145px]">
            <img
              src={getImageUrl(store?.storeLogo, "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=300")}
              alt={store?.storeName || "Store"}
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.12]"
            />
          </div>

          {/* PROFILE CONTENT */}

          <div className="flex flex-1 flex-col justify-between gap-5 md:flex-row">
            <div className="text-center md:text-left">
              <h2 className="flex items-center justify-center gap-1.5 font-serif text-3xl font-semibold text-creator-text md:justify-start">{store?.storeName || "Your handmade store"}</h2>

              <p className="mb-2 mt-1 font-caveat text-xl text-creator-pink">Handcrafted with love ✨</p>

              <p className="max-w-[500px] text-sm leading-6 text-creator-text/60">{store?.bio || "Thoughtful handmade pieces for everyday joy."}</p>

              {/* SOCIAL PNGS — PRESERVED */}

              <div className="mt-3 flex items-center justify-center gap-4 rounded-full bg-creator-bg/50 py-2 md:justify-start">
                {/* INSTAGRAM */}

                <div
                  onClick={openInstagram}
                  className={`flex items-center gap-1.5 text-creator-primary transition-all duration-300 ${store?.instagramLink ? "cursor-pointer hover:scale-105 hover:-rotate-2" : ""}`}
                >
                  <img src={instagramImg} alt="Instagram" loading="lazy" fetchPriority="low" decoding="async" className="h-10 w-10 object-cover transition-transform duration-300 hover:rotate-6" />

                  <p className="font-sans text-xs font-semibold text-creator-text">{store?.instagramUsername || "Not attached"}</p>
                </div>

                {/* FACEBOOK */}

                <div
                  onClick={openFacebook}
                  className={`flex items-center gap-1.5 text-creator-primary transition-all duration-300 ${store?.facebookLink ? "cursor-pointer hover:scale-105 hover:rotate-2" : ""}`}
                >
                  <img src={facebookImg} alt="Facebook" loading="lazy" fetchPriority="low" decoding="async" className="h-10 w-10 object-cover transition-transform duration-300 hover:-rotate-6" />

                  <p className="font-sans text-xs font-semibold text-creator-text">{store?.facebookLink ? "Facebook" : "Not attached"}</p>
                </div>

                {/* WHATSAPP */}

                <div onClick={openWhatsApp} className="flex cursor-pointer items-center gap-1.5 text-creator-primary transition-all duration-300 hover:scale-105 hover:rotate-2">
                  <img src={whatsappImg} alt="WhatsApp" loading="lazy" fetchPriority="low" decoding="async" className="h-10 w-10 object-cover transition-transform duration-300 hover:-rotate-6" />

                  <p className="font-sans text-xs font-semibold text-creator-text">{store?.whatsappNumber || "not available"}</p>
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <div className="flex flex-col items-center md:items-end">
              <div className="flex gap-2">
                <button
                  onClick={openInstagram}
                  className="rounded-full bg-creator-text px-7 py-2.5 text-xs text-white transition-all duration-300 hover:-translate-y-0.5 hover:rotate-[-1deg] hover:bg-creator-primary hover:shadow-lg active:scale-95"
                >
                  Follow My Store
                </button>

                <button
                  onClick={shareStore}
                  aria-label="Share store"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:rotate-6 hover:shadow-md active:scale-90"
                >
                  <Share2 size={17} />
                </button>
              </div>

              {/* ================================================= */}
              {/* YOUR ORIGINAL MORE STATS STICKER */}
              {/* ================================================= */}

              <div className="relative mt-3 h-32 w-32 cursor-pointer transition-all duration-500 hover:rotate-[-5deg] hover:scale-105">
                <img src={redcolorImg} alt="" loading="lazy" fetchPriority="low" decoding="async" className="h-32 w-32 object-contain transition-transform duration-500 hover:rotate-3" />

                <p className="absolute inset-0 flex items-center justify-center px-5 text-center font-caveat text-sm font-semibold leading-4 text-creator-text">
                  More stats
                  <br />
                  coming soon!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* COLLECTION HEADER */}
        {/* ================================================= */}

        <section id="collection" className="publicstore-collection relative scroll-mt-10 pt-12">
          {/* handwritten decoration */}

          <div className="absolute -right-1 top-10 hidden rotate-[-8deg] font-caveat text-lg text-creator-text/60 sm:block">
            little things.
            <br />
            big joy ♡
          </div>

          <p className="font-caveat text-lg text-creator-pink">the little collection</p>

          <h2 className="mt-1 font-serif text-3xl font-semibold text-creator-text sm:text-4xl">
            Made with intention
            <span className="text-creator-pink">.</span>
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-creator-text/50">A few things made by hand, one piece at a time.</p>

          {/* CATEGORY */}

          <div className="scrollbar-hide flex gap-2 overflow-x-auto py-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-[11px] transition-all duration-300 hover:-translate-y-0.5 ${activeCategory === category ? "bg-creator-pink text-white shadow-sm" : "bg-white/75 text-creator-text/60 hover:bg-white hover:shadow-sm"}`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* ================================================= */}
        {/* EMPTY CATEGORY */}
        {/* ================================================= */}

        {products.length > 0 && filteredProducts.length === 0 && (
          <section className="publicstore-empty relative mb-14 overflow-hidden rounded-[26px] border border-dashed border-creator-text/15 bg-white/60 px-6 py-20 text-center">
            {/* decoration */}

            <span className="absolute left-6 top-5 rotate-[-10deg] font-caveat text-xl text-creator-pink/60">♡</span>

            <span className="absolute right-7 bottom-6 rotate-6 font-caveat text-lg text-creator-text/40">maybe soon...</span>

            <div className="mx-auto flex h-16 w-16 rotate-[-4deg] items-center justify-center rounded-full bg-creator-accent/50 transition-transform duration-500 hover:rotate-6">
              <Package size={25} />
            </div>

            <h3 className="mt-5 font-serif text-2xl font-semibold">No {activeCategory} products</h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-creator-text/50">There are currently no {activeCategory.toLowerCase()} products available in this store.</p>
          </section>
        )}

        {/* ================================================= */}
        {/* NO PRODUCTS */}
        {/* ================================================= */}

        {products.length === 0 && (
          <section className="publicstore-empty mb-14 rounded-[26px] border border-dashed border-creator-text/15 bg-white/60 px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-creator-accent/40">
              <Package size={25} />
            </div>

            <h3 className="mt-5 font-serif text-2xl font-semibold">Products are coming soon.</h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-creator-text/50">This creator is still preparing the collection. Check back soon.</p>
          </section>
        )}

        {/* ================================================= */}
        {/* PRODUCTS */}
        {/* ================================================= */}

        {filteredProducts.length > 0 && (
          <section id="products-grid-section" className="publicstore-products relative scroll-mt-24 pb-16 pt-1">
            {/* small decorative line */}

            {/* <div className="pointer-events-none absolute -left-5 top-0 hidden rotate-[-8deg] font-caveat text-sm text-creator-text/40 lg:block">made slowly ♡</div> */}
            

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-3">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  productIndex={index}
                  navigate={navigate}
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                  isWishlisted={wishlistIds.includes(product._id)}
                  
                />
              ))}
            </div>

            
          </section>
        )}

        {/* ================================================= */}
        {/* CREATOR STORY */}
        {/* ================================================= */}

        <AboutStore store={store} getImageUrl={getImageUrl} />
        {/* ================================================= */}
        {/* CONTACT / ORDER CTA */}
        {/* ================================================= */}

        {(store?.whatsappNumber || store?.instagramLink) && (
          <section className="publicstore-cta relative mb-16 overflow-hidden rounded-[28px] bg-creator-accent px-7 py-10 sm:px-12">
            {/* decorative */}

            <div className="absolute -right-8 -top-8 h-32 w-32 rotate-12 rounded-full border-[18px] border-white/30" />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-caveat text-xl text-creator-pink">found something you love?</p>

                <h2 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Talk directly to the creator.</h2>

                <p className="mt-2 max-w-lg text-sm leading-6 text-creator-text/55">Ask about availability, customization, or anything else before placing your order.</p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                {store?.whatsappNumber && (
                  <button
                    onClick={openWhatsApp}
                    className="flex items-center gap-2 rounded-full bg-creator-text px-5 py-3 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:rotate-[-1deg] hover:shadow-lg"
                  >
                    <MessageCircle size={15} />
                    WhatsApp
                  </button>
                )}

                {store?.instagramLink && (
                  <button
                    onClick={openInstagram}
                    className="flex items-center gap-2 rounded-full border border-creator-text/20 bg-white/60 px-5 py-3 text-xs font-semibold text-creator-text transition-all duration-300 hover:-translate-y-1 hover:rotate-1 hover:bg-white"
                  >
                    Instagram
                  </button>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ===================================================== */}
      {/* FLOATING WISHLIST */}
      {/* ===================================================== */}

      <button
        aria-label="Open wishlist"
        onClick={() => navigate(`/publicstore/${encodeURIComponent(validStoreName)}/wishlist`)}
        className="fixed bottom-[88px] right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-white bg-white text-creator-text shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:scale-110 hover:-rotate-6 hover:shadow-xl active:scale-90"
      >
        <Heart size={20} fill={wishlistIds.length > 0 ? "currentColor" : "none"} className={wishlistIds.length > 0 ? "text-creator-pink" : "text-creator-text"} />
        <span className="absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-creator-pink px-1 text-[9px] font-bold text-white">{wishlistIds.length}</span>
      </button>

      {/* ===================================================== */}
      {/* FLOATING CART */}
      {/* ===================================================== */}

      <button
        aria-label="Open cart"
        onClick={() => navigate(`/publicstore/${encodeURIComponent(validStoreName)}/cart`)}
        className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-white bg-creator-text text-white shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-xl active:scale-90"
      >
        <ShoppingCart size={23} />

        <span className="absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-creator-pink px-1 text-[9px] font-bold text-white">{cartCount}</span>
      </button>

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <footer className="publicstore-footer relative overflow-hidden border-t border-creator-text/10 bg-creator-text px-7 py-10 text-white">
        {/* decorative handwritten */}

        <span className="pointer-events-none absolute right-5 top-5 rotate-[-8deg] font-caveat text-lg text-white/35">
          Support
          <br />
          small
          <br />
          creators ♡
        </span>

        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* BRAND */}

          <div>
            <h2 className="font-serif text-2xl">
              Jhankoo
              <span className="ml-1 text-xs">✦</span>
            </h2>

            <p className="mt-1 text-[10px] text-white/50">Support creators · Shop handmade</p>
          </div>

          {/* CENTER */}

          <div className="flex items-center gap-4">
            <div className="text-right font-caveat text-base leading-4 text-white/65">
              Small creators.
              <br />
              Big stories.
            </div>

            <ArrowRight size={25} className="text-white/50" />

            <Sparkles size={20} className="text-creator-pink" />
          </div>

          {/* HOME */}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex w-fit items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-[10px] transition-all duration-300 hover:bg-white hover:text-creator-text hover:-translate-y-0.5"
          >
            <Home size={15} />
            Back to Home
          </button>
        </div>

        {/* COPYRIGHT */}

        <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-2 border-t border-white/10 pt-6 text-[9px] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Jhankoo</span>

          <span>Made for small creators.</span>
        </div>
      </footer>
      {/* End Footer */}
      <Footer />
    </div>
  );
};

export default PublicStore;
