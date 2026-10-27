import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Heart, MapPin, MessageCircle, Minus, Package, Plus, Share2, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../components/API/API";
import { addToCartStorage } from "../utils/storeStorage";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [fetching, setFetching] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [saved, setSaved] = useState(false);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  /* =========================================================
     HELPERS
  ========================================================= */

  const getImageUrl = (image) => {
    if (!image) return "";
    if (typeof image === "string") return image;
    return image?.url || "";
  };

  const getProductImages = (currentProduct) => {
    if (!currentProduct) return [];

    return [currentProduct.productImage1, currentProduct.productImage2, currentProduct.productImage3, currentProduct.productImage4].map(getImageUrl).filter(Boolean);
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  /* =========================================================
     FETCH PRODUCT
  ========================================================= */

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;

      try {
        setFetching(true);

        const response = await API.get(`/api/products/${id}`);
        const data = response.data;

        console.log("Fetched product:", data);

        if (!data?.product) {
          setProduct(null);
          return;
        }

        const currentProduct = data.product;

        const images = getProductImages(currentProduct);

        setProduct({
          ...currentProduct,
          extractedImages: images,
        });

        setActiveImageIndex(0);
        setQuantity(1);

        /*
          Product API ke response me agar store details hain
          toh unhe use karenge.
        */
        if (data.store) {
          setStore(data.store);
        } else {
          /*
            Agar product ke andar sellerUsername hai,
            toh public store API se store details lene ki
            koshish karenge.
          */
          if (currentProduct.sellerUsername) {
            try {
              const storeResponse = await API.get(`/api/shop/${currentProduct.sellerUsername}`);

              setStore(storeResponse.data?.store || null);
            } catch (storeError) {
              console.log("Store details unavailable:", storeError);

              setStore({
                storeName: currentProduct.storeName || "Jhankoo Creator",
              });
            }
          } else {
            setStore({
              storeName: currentProduct.storeName || "Jhankoo Creator",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setProduct(null);
      } finally {
        setFetching(false);
      }
    };

    fetchProductData();
  }, [id]);

  /* =========================================================
     IMAGE CONTROLS
  ========================================================= */

  const images = product?.extractedImages || [];

  const goToImage = (index) => {
    if (!images.length) return;

    const safeIndex = (index + images.length) % images.length;

    setActiveImageIndex(safeIndex);
  };

  const nextImage = () => {
    goToImage(activeImageIndex + 1);
  };

  const previousImage = () => {
    goToImage(activeImageIndex - 1);
  };

  /* =========================================================
     MOBILE SWIPE
  ========================================================= */

  const handleTouchStart = (event) => {
    setTouchEnd(null);
    setTouchStart(event.targetTouches[0].clientX);
  };

  const handleTouchMove = (event) => {
    setTouchEnd(event.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      nextImage();
    }

    if (distance < -minSwipeDistance) {
      previousImage();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  /* =========================================================
     QUANTITY
  ========================================================= */

  const stock = Number(product?.stocks || 0);
  const isOutOfStock = stock <= 0;

  const handleQuantity = (type) => {
    if (!product || isOutOfStock) return;

    if (type === "minus") {
      setQuantity((prev) => Math.max(1, prev - 1));
    }

    if (type === "plus") {
      setQuantity((prev) => Math.min(stock, prev + 1));
    }
  };

  /* =========================================================
     CART
  ========================================================= */

  const addToCart = () => {
    if (!product || isOutOfStock || addingToCart) return;

    setAddingToCart(true);

    const publicStoreMatch = pathname.match(/^\/publicstore\/([^/]+)/);
    const cartStoreName =
      (publicStoreMatch ? decodeURIComponent(publicStoreMatch[1]) : "") ||
      store?.storeName ||
      product.storeName ||
      product.sellerUsername;

    if (!cartStoreName) {
      setAddingToCart(false);
      toast.error("Unable to identify the store for this product.");
      return;
    }

    for (let index = 0; index < quantity; index += 1) {
      addToCartStorage(cartStoreName, {
        ...product,
        storeName: cartStoreName,
      });
    }

    setAddingToCart(false);
    setAddedToCart(true);
    toast.success(`${product.productName} added to cart`, {
      position: "top-right",
      autoClose: 1800,
    });

    setTimeout(() => {
      setAddedToCart(false);
    }, 1800);
  };

  /* =========================================================
     WHATSAPP ORDER
  ========================================================= */

  const getWhatsAppLink = () => {
    if (!store?.whatsappNumber) return null;

    const number = String(store.whatsappNumber).replace(/\D/g, "");

    if (!number) return null;

    const message = `
Hi ${store?.storeName || "Creator"}! 👋

I want to order:

*${product?.productName || "Product"}*
Quantity: ${quantity}
Price: ₹${formatPrice(product?.productPrice)}

I found this product on your Jhankoo store.
    `.trim();

    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  const orderOnWhatsApp = () => {
    const link = getWhatsAppLink();

    if (!link) return;

    window.open(link, "_blank", "noopener,noreferrer");
  };

  /* =========================================================
     SHARE
  ========================================================= */

  const handleShare = async () => {
    const currentUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.productName || "Product",
          text: `Check out ${product?.productName} on Jhankoo ✨`,
          url: currentUrl,
        });
      } else {
        await navigator.clipboard.writeText(currentUrl);

        window.alert("Product link copied! Share it anywhere ✨");
      }
    } catch (error) {
      console.log("Share cancelled:", error);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (fetching) {
    return (
      <div className="min-h-screen bg-creator-bg-butter px-5 py-10">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-8 h-4 w-32 rounded-full bg-creator-text/10" />

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-square rounded-[28px] bg-white/70" />

            <div className="space-y-5 pt-5">
              <div className="h-5 w-40 rounded-full bg-creator-text/10" />
              <div className="h-12 w-3/4 rounded-xl bg-creator-text/10" />
              <div className="h-6 w-40 rounded-full bg-creator-text/10" />
              <div className="h-20 rounded-2xl bg-creator-text/10" />
              <div className="h-14 rounded-full bg-creator-text/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     NOT FOUND
  ========================================================= */

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-creator-bg-butter px-5">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <Package size={25} />
          </div>

          <h1 className="font-serif text-2xl font-semibold">Creation not found</h1>

          <p className="mt-2 text-sm leading-6 text-creator-text/55">This product may have been removed or is no longer available.</p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-creator-text px-6 py-3 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
          >
            <ArrowLeft size={15} />
            Go back
          </button>
        </div>
      </div>
    );
  }

  const activeImage = images[activeImageIndex] || images[0];

  const storeLogo = getImageUrl(store?.storeLogo || store?.profileImage);

  const whatsappLink = getWhatsAppLink();

  return (
    <div className="min-h-screen overflow-x-hidden bg-creator-bg-butter text-creator-text antialiased">
      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-7 sm:px-6 lg:px-0 lg:pt-10">
        {/* Breadcrumb */}
        <div className="mb-7 flex items-center gap-2 overflow-hidden text-[10px] uppercase tracking-[0.15em] text-creator-text/40">
          <button onClick={() => navigate(-1)} className="shrink-0 transition hover:text-creator-pink">
            Store
          </button>

          <span>/</span>

          <span className="shrink-0">{product.category || "Handmade"}</span>

          <span>/</span>

          <span className="truncate font-semibold text-creator-text/65">{product.productName}</span>
        </div>

        {/* ===================================================
            PRODUCT AREA
        ==================================================== */}

        <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          {/* =================================================
              LEFT - GALLERY
          ================================================== */}

          <div>
            <div className="relative">
              {/* Main Image */}
              <div
                className="group relative aspect-square overflow-hidden rounded-[28px] border border-creator-text/[0.07] bg-white p-2 shadow-[0_18px_50px_rgba(82,60,42,0.07)] sm:p-3"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Handmade sticker */}
                <div className="absolute left-5 top-5 z-20 rotate-[-4deg] rounded-sm border border-creator-text/10 bg-[#f5e8c9]/95 px-3 py-2 shadow-sm hover:rotate-[-2deg] hover:shadow-md">
                  <p className="font-caveat text-sm">made with love ✦</p>
                </div>

                {/* Image count */}
                {images.length > 1 && (
                  <div className="absolute right-5 top-5 z-20 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold tracking-wide shadow-sm backdrop-blur">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                )}

                <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-creator-bg">
                  {activeImage && (
                    <img
                      key={activeImage}
                      src={activeImage}
                      alt={product.productName}
                      loading="eager"
                      fetchPriority="high"
                      decoding="sync"
                      className="h-full w-full select-none object-cover transition duration-500 ease-out group-hover:scale-[1.025]"
                      draggable="false"
                    />
                  )}

                  {/* soft overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.08] via-transparent to-transparent" />
                </div>

                {/* Previous */}
                {images.length > 1 && (
                  <button
                    onClick={previousImage}
                    aria-label="Previous image"
                    className="absolute left-5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 opacity-0 shadow-md transition duration-200 hover:scale-105 active:scale-90 group-hover:opacity-100 sm:flex"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}

                {/* Next */}
                {images.length > 1 && (
                  <button
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 opacity-0 shadow-md transition duration-200 hover:scale-105 active:scale-90 group-hover:opacity-100 sm:flex"
                  >
                    <ChevronRight size={18} />
                  </button>
                )}

                {/* Bottom dots */}
                {images.length > 1 && (
                  <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/85 px-3 py-2 backdrop-blur">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        aria-label={`View image ${index + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${activeImageIndex === index ? "w-5 bg-creator-text" : "w-1.5 bg-creator-text/25 hover:bg-creator-text/50"}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile swipe hint */}
              {images.length > 1 && <p className="mt-2 text-center text-[9px] text-creator-text/35 sm:hidden">Swipe to see more photos</p>}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`group relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl border-2 bg-white p-0.5 transition duration-300 sm:h-[76px] sm:w-[76px] ${activeImageIndex === index ? "scale-[0.96] border-creator-pink shadow-md" : "border-transparent opacity-65 hover:scale-[0.98] hover:opacity-100"}`}
                  >
                    <img src={image} alt={`${product.productName} ${index + 1}`} loading={index < 2 ? "eager" : "lazy"} decoding="async" className="h-full w-full rounded-lg object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* =================================================
              RIGHT - PRODUCT INFORMATION
          ================================================== */}

          <div className="flex flex-col">
            {/* Store */}
            <div className="mb-5 flex items-center justify-between gap-3">
              <button onClick={() => navigate(-1)} className="group flex min-w-0 items-center gap-2">
                {storeLogo ? (
                  <img
                    src={storeLogo}
                    alt={store?.storeName || "Creator"}
                    loading="lazy"
                    fetchPriority="low"
                    decoding="async"
                    className="h-9 w-9 rounded-full border border-white object-cover shadow-sm transition group-hover:rotate-3"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-creator-accent text-xs font-semibold">{(store?.storeName || "C").charAt(0).toUpperCase()}</div>
                )}

                <div className="min-w-0 text-left">
                  <p className="text-[9px] uppercase tracking-[0.16em] text-creator-text/35">from</p>

                  <p className="truncate text-xs font-semibold">{store?.storeName || product.storeName || "Jhankoo Creator"}</p>
                </div>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  aria-label="Share product"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-creator-text/10 bg-white/60 transition hover:-translate-y-0.5 hover:rotate-3 hover:bg-white hover:shadow-sm active:scale-95"
                >
                  <Share2 size={16} />
                </button>

                <button
                  onClick={() => setSaved((prev) => !prev)}
                  aria-label="Save product"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition duration-300 ${saved ? "border-creator-pink bg-creator-pink/10 text-creator-pink" : "border-creator-text/10 bg-white hover:-translate-y-0.5 hover:rotate-[-4deg]"}`}
                >
                  <Heart size={17} fill={saved ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-creator-pink/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-creator-pink">{product.category || "Handmade"}</span>

              {product.customization && (
                <span className="flex items-center gap-1 rounded-full bg-creator-accent/30 px-3 py-1.5 text-[9px] font-semibold text-creator-text/70">
                  <Sparkles size={11} />
                  Customizable
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="max-w-xl font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{product.productName}</h1>

            <p className="mt-3 font-caveat text-xl text-creator-pink sm:text-2xl">A little piece made just for you ✦</p>

            {/* Shipping details are temporarily disabled. */}
            {/*
            <div className="mt-2">
              ...
            </div>
            */}

            {/* Description */}
            <div className="mt-6">
              <p className="text-sm leading-7 text-creator-text/65">{product.productDescription || "A thoughtfully handmade piece created with care."}</p>
            </div>

            {/* Product Details */}
            <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-creator-text/[0.07] bg-white/60">
              {product.color && (
                <div className="border-b border-r border-creator-text/[0.07] p-4">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-creator-text/35">Color</p>

                  <p className="mt-1 text-xs font-semibold capitalize">{product.color}</p>
                </div>
              )}

              {product.size && (
                <div className="border-b border-creator-text/[0.07] p-4">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-creator-text/35">Size</p>

                  <p className="mt-1 text-xs font-semibold">{product.size}</p>
                </div>
              )}

              <div className="border-r border-creator-text/[0.07] p-4">
                <p className="text-[9px] uppercase tracking-[0.15em] text-creator-text/35">Making</p>

                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold">
                  <Heart size={12} />
                  Handmade
                </p>
              </div>

              <div className="p-4">
                <p className="text-[9px] uppercase tracking-[0.15em] text-creator-text/35">Customization</p>

                <p className="mt-1 text-xs font-semibold">{product.customization ? "Available" : "Not available"}</p>
              </div>
            </div>

            {/* Extra Details */}
            <div className="mt-5 rounded-2xl bg-creator-accent/20 px-4 py-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-creator-text/45">A little more about it</p>

              <p className="mt-1 text-xs leading-5 text-creator-text/65">
                {product.extraDetails?.trim() && product.extraDetails.trim().toLowerCase() !== "none" ? product.extraDetails : "No extra details"}
              </p>
            </div>

            {/* Quantity */}
            {!isOutOfStock && (
              <div className="mt-7 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold">Quantity</p>

                  <p className="mt-0.5 text-[9px] text-creator-text/40">Choose how many you'd like</p>
                </div>

                <div className="flex items-center rounded-full border border-creator-text/10 bg-white p-1 shadow-sm">
                  <button
                    onClick={() => handleQuantity("minus")}
                    disabled={quantity <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-creator-bg disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="min-w-[32px] text-center text-sm font-semibold">{quantity}</span>

                  <button
                    onClick={() => handleQuantity("plus")}
                    disabled={quantity >= stock}
                    className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-creator-bg disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* =================================================
                CTA
            ================================================== */}

            <div className="mt-7 space-y-3">
              {!isOutOfStock && (
                <button
                  onClick={addToCart}
                  disabled={addingToCart}
                  className={`group flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold shadow-[0_10px_25px_rgba(44,50,47,0.12)] transition duration-300 active:scale-[0.98] ${addedToCart ? "bg-emerald-600 text-white" : "bg-creator-text text-white hover:-translate-y-1 hover:bg-creator-primary"}`}
                >
                  {addingToCart ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Adding...
                    </>
                  ) : addedToCart ? (
                    <>
                      <Check size={17} className="animate-[bounce_0.4s_ease]" />
                      Added to cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={17} />
                      Add to cart
                    </>
                  )}
                </button>
              )}

              {whatsappLink && !isOutOfStock && (
                <button
                  onClick={orderOnWhatsApp}
                  className="group flex w-full items-center justify-center gap-2 rounded-full border border-creator-text/10 bg-white px-6 py-4 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 active:scale-[0.98]"
                >
                  <MessageCircle size={17} className="transition group-hover:rotate-[-8deg]" />
                  Order via WhatsApp
                  <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                </button>
              )}

              {isOutOfStock && <div className="rounded-full border border-red-100 bg-red-50 px-6 py-4 text-center text-sm font-semibold text-red-600">This creation is currently unavailable</div>}
            </div>

            {/* Creator reassurance */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2 rounded-2xl bg-white/50 p-3">
                <Heart size={15} className="mt-0.5 shrink-0 text-creator-pink" />

                <div>
                  <p className="text-[10px] font-semibold">Made with care</p>

                  <p className="mt-0.5 text-[8px] leading-4 text-creator-text/40">Created by a small business</p>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-2xl bg-white/50 p-3">
                <MessageCircle size={15} className="mt-0.5 shrink-0" />

                <div>
                  <p className="text-[10px] font-semibold">Direct creator</p>

                  <p className="mt-0.5 text-[8px] leading-4 text-creator-text/40">Ask about customization</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            CREATOR NOTE
        ==================================================== */}

        <section className="relative mt-16 overflow-hidden rounded-[28px] border border-creator-text/[0.07] bg-[#f5e9d1] px-6 py-9 sm:px-10">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-creator-text/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full border border-creator-text/10" />

          <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-xl">
              <p className="font-caveat text-lg text-creator-pink">more than just a product ✦</p>

              <h2 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">You're supporting someone's craft.</h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-creator-text/55">
                Every piece on Jhankoo comes from a small creator building something of their own. Your order directly supports their time, creativity and work.
              </p>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="group flex shrink-0 items-center gap-2 rounded-full bg-creator-text px-6 py-3 text-xs font-semibold text-white transition hover:-translate-y-1 hover:shadow-lg active:scale-95"
            >
              Explore their store
              <ArrowRight size={14} className="transition group-hover:translate-x-1" />
            </button>
          </div>
        </section>

        {/* ===================================================
            STORE LOCATION / CONTACT
        ==================================================== */}

        {(store?.address || store?.whatsappNumber) && (
          <section className="mt-5 flex flex-wrap items-center justify-center gap-5 px-4 py-5 text-center text-[10px] text-creator-text/45 sm:gap-8">
            {store?.address && (
              <span className="flex items-center gap-1.5">
                <MapPin size={13} />
                {store.address}
              </span>
            )}

            {store?.whatsappNumber && (
              <span className="flex items-center gap-1.5">
                <MessageCircle size={13} />
                Direct orders available
              </span>
            )}
          </section>
        )}
      </main>

      {/* =====================================================
          MOBILE STICKY ORDER BAR
      ====================================================== */}

      {!isOutOfStock && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-creator-text/[0.08] bg-creator-bg-butter/95 p-3 backdrop-blur-xl sm:hidden">
          <div className="mx-auto flex max-w-md items-center gap-2">
            <button
              onClick={addToCart}
              className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-4 text-xs font-semibold text-white shadow-lg transition active:scale-[0.98] ${addedToCart ? "bg-emerald-600" : "bg-creator-text"}`}
            >
              {addedToCart ? (
                <>
                  <Check size={16} />
                  Added
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  Add to cart
                </>
              )}
            </button>

            {whatsappLink && (
              <button
                onClick={orderOnWhatsApp}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 transition active:scale-90"
                aria-label="Order on WhatsApp"
              >
                <MessageCircle size={19} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
