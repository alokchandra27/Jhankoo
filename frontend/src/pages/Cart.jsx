
import React, { useEffect, useMemo, useState } from "react";
import whatsappImg from "../assets/whatsapp.webp";
import instagramImg from "../assets/instagram.webp";
import facebookImg from "../assets/facebook.webp";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  // Facebook,
  Heart,
  // Instagram,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "../utils/storeStorage";

// ==========================================================
// IMAGE HELPER
// ==========================================================

const getImageUrl = (image, fallback = "") => {
  if (!image) return fallback;

  if (typeof image === "string") {
    return image;
  }

  return image?.url || fallback;
};

// ==========================================================
// CART
// ==========================================================

const Cart = () => {
  const navigate = useNavigate();
  const { storeName } = useParams();

  const [cart, setCart] = useState([]);

  // Store contact information
  const [store, setStore] = useState(null);
  const [loadingStore, setLoadingStore] = useState(true);

  // Query / order UI
  const [showQuery, setShowQuery] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Which message are we previewing?
  const [messageType, setMessageType] = useState(null);

  // Customer details
  const [customer, setCustomer] = useState({
    name: "",
    street: "",
    address: "",
    mobile: "",
    alternateMobile: "",
  });

  // ==========================================================
  // LOAD CART
  // ==========================================================

  useEffect(() => {
    setCart(getCart(storeName));
  }, [storeName]);

  // ==========================================================
  // LOAD STORE CONTACT DATA
  // ==========================================================

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoadingStore(true);

        const response = await fetch(
          `https://jhankoo.onrender.com/api/shop/${encodeURIComponent(storeName)}`
        );

        if (!response.ok) {
          throw new Error("Unable to fetch store");
        }

        const data = await response.json();

        setStore(data?.store || data);
      } catch (error) {
        console.error("Store contact fetch error:", error);
        setStore(null);
      } finally {
        setLoadingStore(false);
      }
    };

    if (storeName) {
      fetchStore();
    }
  }, [storeName]);

  // ==========================================================
  // TOTAL ITEMS
  // ==========================================================

  const totalItems = useMemo(() => {
    return cart.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );
  }, [cart]);

  // ==========================================================
  // PRODUCT SUBTOTAL
  // Shipping is confirmed separately by the seller.
  // ==========================================================

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      return (
        total +
        Number(item.productPrice || 0) * Number(item.quantity || 0)
      );
    }, 0);
  }, [cart]);

  // ==========================================================
  // CHANGE QUANTITY
  // ==========================================================

  const changeQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    const updated = updateCartQuantity(storeName, productId, quantity);

    setCart(updated);
  };

  // ==========================================================
  // REMOVE ITEM
  // ==========================================================

  const removeItem = (productId) => {
    const updated = removeFromCart(storeName, productId);

    setCart(updated);
  };

  // ==========================================================
  // CUSTOMER INPUT
  // ==========================================================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================================
  // STORE CONTACT HELPERS
  // ==========================================================

  const whatsappNumber = String(store?.whatsappNumber || "").trim();

  const instagramUsername = String(store?.instagramUsername || "")
    .replace("@", "")
    .trim();

  const instagramLink =
    String(store?.instagramLink || "").trim() ||
    (instagramUsername
      ? `https://instagram.com/${instagramUsername}`
      : "");

  const facebookLink = String(store?.facebookLink || "").trim();

  const hasContactLinks = Boolean(
    whatsappNumber || instagramLink || facebookLink
  );

  // ==========================================================
  // BUILD ITEM LIST
  // ==========================================================

  const buildProductsText = () => {
    return cart
      .map((item, index) => {
        const price = Number(item.productPrice || 0);
        const quantity = Number(item.quantity || 0);
        const itemTotal = price * quantity;

        return `${index + 1}. ${item.productName}
   Qty: ${quantity}
   Price: ₹${price.toLocaleString("en-IN")}
   Item Total: ₹${itemTotal.toLocaleString("en-IN")}`;
      })
      .join("\n\n");
  };

  // ==========================================================
  // QUERY MESSAGE
  // ==========================================================

  const createQueryMessage = () => {
    return `Hi! I found ${store?.storeName || storeName} on Jhankoo. 👋

I'd like to ask about these products:

${cart.map((item) => `• ${item.productName} × ${item.quantity}`).join("\n")}

Could you please tell me about availability, customization and delivery?

Thank you!`;
  };

  // ==========================================================
  // ORDER MESSAGE
  // Shipping and final payable amount are confirmed by seller.
  // ==========================================================

  const createOrderMessage = () => {
    return `Hi! I found ${store?.storeName || storeName} on Jhankoo and I'd like to place an order. ✨

ORDER DETAILS
--------------------
${buildProductsText()}

PRODUCT SUBTOTAL
₹${subtotal.toLocaleString("en-IN")}

SHIPPING CHARGES
To be confirmed by the seller based on delivery location and combined parcel.

FINAL PAYABLE AMOUNT
To be confirmed by the seller before order confirmation.

CUSTOMER DETAILS
--------------------
Name: ${customer.name}
Mobile: ${customer.mobile}
${customer.alternateMobile ? `Alternative Mobile: ${customer.alternateMobile}\n` : ""}Street / Locality: ${customer.street}
Address: ${customer.address}

Please confirm product availability, shipping charges and the final payable amount before confirming my order.

Thank you!`;
  };

  // ==========================================================
  // OPEN MESSAGE PREVIEW
  // ==========================================================

  const openQueryPreview = () => {
    if (!cart.length) return;

    setMessageType("query");
    setShowPreview(true);
  };

  // ==========================================================
  // OPEN ORDER FORM
  // ==========================================================

  const openOrderForm = () => {
    setShowOrderForm(true);

    setTimeout(() => {
      document.getElementById("order-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  // ==========================================================
  // VALIDATE CUSTOMER
  // ==========================================================

  const validateCustomer = () => {
    if (!customer.name.trim()) {
      alert("Please enter your full name.");
      return false;
    }

    if (!customer.mobile.trim()) {
      alert("Please enter your mobile number.");
      return false;
    }

    if (!customer.street.trim()) {
      alert("Please enter your street / locality.");
      return false;
    }

    if (!customer.address.trim()) {
      alert("Please enter your complete address.");
      return false;
    }

    return true;
  };

  // ==========================================================
  // OPEN ORDER PREVIEW
  // ==========================================================

  const openOrderPreview = () => {
    if (!validateCustomer()) return;

    if (!whatsappNumber) {
      alert("This creator has not added any contact information.");
      return;
    }

    setMessageType("order");
    setShowPreview(true);
  };

  // ==========================================================
  // OPEN WHATSAPP
  // ==========================================================

  const sendWhatsApp = () => {
    if (!whatsappNumber) {
      alert("This creator has not added WhatsApp ordering yet.");
      return;
    }

    const cleanNumber = String(whatsappNumber).replace(/\D/g, "");

    const message =
      messageType === "order"
        ? createOrderMessage()
        : createQueryMessage();

    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    // Don't clear the cart.
    // Opening WhatsApp doesn't guarantee that the message was sent.
  };

  // ==========================================================
  // OPEN INSTAGRAM
  // ==========================================================

  const sendInstagram = () => {
    if (!instagramLink) {
      alert("This creator has not added Instagram yet.");
      return;
    }

    const message =
      messageType === "order"
        ? createOrderMessage()
        : createQueryMessage();

    // Instagram doesn't provide a reliable universal
    // pre-filled arbitrary DM URL for this flow.
    // Copy message first, then open creator profile.

    navigator.clipboard
      ?.writeText(message)
      .then(() => {
        alert(
          "Message copied! Instagram will open next. Paste it in the creator's DM."
        );

        window.open(instagramLink, "_blank", "noopener,noreferrer");
      })
      .catch(() => {
        window.open(instagramLink, "_blank", "noopener,noreferrer");
      });
  };

  // ==========================================================
  // OPEN FACEBOOK
  // ==========================================================

  const sendFacebook = () => {
    if (!facebookLink) {
      alert("This creator has not added Facebook yet.");
      return;
    }

    const message =
      messageType === "order"
        ? createOrderMessage()
        : createQueryMessage();

    navigator.clipboard
      ?.writeText(message)
      .then(() => {
        alert(
          "Message copied! Facebook will open next. Paste it in Messenger."
        );

        window.open(facebookLink, "_blank", "noopener,noreferrer");
      })
      .catch(() => {
        window.open(facebookLink, "_blank", "noopener,noreferrer");
      });
  };

  // ==========================================================
  // EMPTY CART
  // ==========================================================

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-creator-bg-butter px-4 py-10 font-caveat">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-[32px] border border-creator-text/10 bg-white px-6 py-14 text-center shadow-[0_20px_60px_rgba(60,50,40,0.07)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-creator-accent/40">
              <ShoppingBag size={30} strokeWidth={1.6} />
            </div>

            <p className="mt-6 font-caveat text-xl text-creator-pink">
              nothing here yet ♡
            </p>

            <h1 className="mt-1 font-serif text-3xl font-semibold">
              Your cart is empty
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-creator-text/50">
              Add something you love from this creator&apos;s collection and
              it&apos;ll appear here.
            </p>

            <button
              onClick={() =>
                navigate(`/publicstore/${encodeURIComponent(storeName)}`)
              }
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-creator-text px-6 py-3 text-xs font-semibold text-white transition hover:-translate-y-1 hover:bg-creator-primary"
            >
              <ArrowLeft size={15} />
              Continue shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN
  // ==========================================================

  return (
    <div className="min-h-screen bg-creator-bg-butter text-creator-text font-caveat">
      <main className="mx-auto w-[calc(100%-24px)] max-w-6xl px-1 pb-20 pt-7 sm:w-[calc(100%-48px)] sm:pt-10">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">
          <button
            onClick={() =>
              navigate(`/publicstore/${encodeURIComponent(storeName)}`)
            }
            className="mb-6 flex items-center gap-2 text-xs text-creator-text/55 transition hover:text-creator-text"
          >
            <ArrowLeft size={15} />
            Continue shopping
          </button>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:items-end lg:justify-between">
            <div>
              <p className="font-caveat text-xl text-creator-pink">
                almost yours ♡
              </p>

              <h1 className="font-serif text-4xl font-semibold">Your Cart</h1>
            </div>

            <p className="text-xs text-creator-text/45">
              {totalItems} {totalItems === 1 ? "item" : "items"} selected
            </p>
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="grid gap-7 lg:grid-cols-[1fr_370px]">
          {/* ===================================================
              LEFT — PRODUCTS
          =================================================== */}

          <section>
            <div className="space-y-3">
              {cart.map((item, index) => {
                const price = Number(item.productPrice || 0);
                const quantity = Number(item.quantity || 0);
                const itemTotal = price * quantity;

                return (
                  <article
                    key={item._id}
                    className="rounded-[15px] border border-creator-text/10 bg-white p-3 shadow-sm transition hover:shadow-md sm:p-4"
                  >
                    <div className="flex gap-4">
                      {/* IMAGE */}

                      <div className="h-28 w-24 shrink-0 overflow-hidden rounded-[18px] bg-creator-bg sm:h-32 sm:w-28">
                        <img
                          src={getImageUrl(item.productImage1)}
                          alt={item.productName}
                          loading={index < 2 ? "eager" : "lazy"}
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* DETAILS */}

                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-3">
                          <div className="min-w-0">
                            <span className="inline-flex rounded-full bg-creator-accent/40 px-2 py-1 text-[8px] uppercase tracking-wider text-creator-text/60">
                              {item.category || "Handmade"}
                            </span>

                            <h2 className="mt-2 truncate font-serif text-base font-semibold sm:text-lg">
                              {item.productName}
                            </h2>

                            {item.size && (
                              <p className="mt-1 text-[10px] text-creator-text/40">
                                Size: {item.size}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => removeItem(item._id)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-creator-text/30 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="mt-5 flex items-end justify-between gap-3">
                          <div>
                            <p className="font-serif text-lg font-semibold">
                              ₹{price.toLocaleString("en-IN")}
                            </p>

                            <p className="mt-1 text-[10px] text-creator-text/40">
                              ₹{itemTotal.toLocaleString("en-IN")} for{" "}
                              {quantity}
                            </p>
                          </div>

                          {/* QUANTITY */}

                          <div className="flex items-center gap-1 rounded-full border border-creator-text/10 bg-creator-bg p-1">
                            <button
                              onClick={() =>
                                changeQuantity(item._id, quantity - 1)
                              }
                              disabled={quantity <= 1}
                              className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <Minus size={12} />
                            </button>

                            <span className="w-6 text-center text-xs font-semibold">
                              {quantity}
                            </span>

                            <button
                              onClick={() =>
                                changeQuantity(item._id, quantity + 1)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-white"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>

                        {item.customization && (
                          <p className="mt-2 text-[9px] text-creator-pink">
                            Customization available
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* =================================================
                QUERY CARD
            ================================================= */}

            <div className="mt-5 rounded-[24px] border border-creator-text/10 bg-white p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-creator-accent/40">
                  <MessageCircle size={19} />
                </div>

                <div className="flex-1">
                  <h3 className="font-serif text-lg font-semibold">
                    Have a question first?
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-creator-text/50">
                    Ask the creator about availability, customization,
                    delivery or anything else.
                  </p>

                  <button
                    // onClick={() => setShowQuery(!showQuery)}
                    className="mt-4 inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-creator-text/10 bg-creator-bg px-4 py-2.5 text-xs font-semibold transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                  >
                    Coming soon
                    {showQuery ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                </div>
              </div>

              {showQuery && (
                <div className="mt-5 border-t border-creator-text/10 pt-5">
                  <MessagePreviewBox
                    message={createQueryMessage()}
                    compact
                  />

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <ContactButton
                      icon={MessageCircle}
                      label="WhatsApp"
                      available={Boolean(whatsappNumber)}
                      onClick={() => {
                        setMessageType("query");
                        setShowPreview(true);
                      }}
                    />

                    <ContactButton
                      // icon={Instagram}
                      label="Instagram"
                      available={Boolean(instagramLink)}
                      onClick={() => {
                        setMessageType("query");
                        setShowPreview(true);
                      }}
                    />

                    <ContactButton
                      // icon={Facebook}
                      label="Facebook"
                      available={Boolean(facebookLink)}
                      onClick={() => {
                        setMessageType("query");
                        setShowPreview(true);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ===================================================
              RIGHT — SUMMARY
          =================================================== */}

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="rounded-[2px] border border-creator-text/10 bg-white p-6 shadow-sm">
              <p className="font-caveat text-lg text-creator-pink">
                your order ♡
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold">
                Order Summary
              </h2>

              {/* PRODUCT SUBTOTAL + SHIPPING NOTE */}

              <div className="my-6 space-y-4 border-y border-creator-text/10 py-5">
                <div className="flex justify-between text-xs text-creator-text/55">
                  <span>Items ({totalItems})</span>

                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="rounded-xl bg-creator-bg p-3">
                  <div className="flex items-center gap-2">
                    <MessageCircle
                      size={15}
                      className="shrink-0 text-creator-primary"
                    />

                    <span className="text-xs font-semibold">
                      Shipping Made Simple!
                    </span>
                  </div>

                  <p className="mt-1.5 text-[11px] leading-5 text-creator-text/60">
                  Shipping may be included! Any extra charges will be confirmed before you place your order by the seller based on your delivery location and combined parcel.
                  
                  </p>
                </div>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-creator-text/55">
                    Product subtotal
                  </p>

                  <p className="mt-1 text-[10px] text-creator-text/40">
                    Shipping charges confirmed before ordering
                  </p>
                </div>

                <strong className="font-serif text-3xl">
                  ₹{subtotal.toLocaleString("en-IN")}
                </strong>
              </div>

              <p className="mt-3 text-right text-[10px] leading-4 text-creator-pink">
                Final payable amount will be confirmed by the seller.
              </p>

              {/* ORDER BUTTON */}

              <button
                onClick={openOrderForm}
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-creator-text py-4 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-creator-primary hover:shadow-lg"
              >
                Place Order
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <p className="mt-3 text-center text-[9px] leading-4 text-creator-text/40">
                You&apos;ll review your order before sending it to the creator.
              </p>
            </div>

            {/* STORE CONTACTS */}

            <div className="mt-4 rounded-[24px] border border-creator-text/10 bg-white p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-creator-text/40">
                Connect with {store?.storeName || "creator"}
              </p>

              {hasContactLinks ? (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {whatsappNumber && (
                    <button
                      onClick={() => {
                        setMessageType("query");
                        setShowPreview(true);
                      }}
                      className="flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl bg-[#EAF9EF] px-2 py-3 text-[10px] font-semibold text-neutral-700 transition hover:-translate-y-1"
                    >
                      <img
                        src={whatsappImg}
                        alt="WhatsApp"
                        loading="lazy"
                        fetchPriority="low"
                        decoding="async"
                        className="h-10 w-10"
                      />
                      WhatsApp
                    </button>
                  )}

                  {instagramLink && (
                    <button
                      onClick={() => {
                        setMessageType("query");
                        setShowPreview(true);
                      }}
                      className="flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl bg-[#FCECF5] px-2 py-3 text-[10px] font-semibold text-neutral-700 transition hover:-translate-y-1"
                    >
                      <img
                        src={instagramImg}
                        alt="Instagram"
                        loading="lazy"
                        fetchPriority="low"
                        decoding="async"
                        className="h-10 w-10"
                      />
                      Instagram
                    </button>
                  )}

                  {facebookLink && (
                    <button
                      onClick={() => {
                        setMessageType("query");
                        setShowPreview(true);
                      }}
                      className="flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl bg-[#EEF4FF] px-2 py-3 text-[10px] font-semibold text-neutral-700 transition hover:-translate-y-1"
                    >
                      <img
                        src={facebookImg}
                        alt="Facebook"
                        loading="lazy"
                        fetchPriority="low"
                        decoding="async"
                        className="h-10 w-10"
                      />
                      Facebook
                    </button>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-xs leading-5 text-creator-text/50">
                  This creator has not added any contact links yet.
                </p>
              )}
            </div>
          </aside>
        </div>

        {/* =====================================================
            ORDER FORM
        ===================================================== */}

        {showOrderForm && (
          <section
            id="order-form"
            className="mt-8 rounded-[30px] border border-creator-text/10 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-caveat text-lg text-creator-pink">
                  almost there ♡
                </p>

                <h2 className="mt-1 font-serif text-2xl font-semibold">
                  Your delivery details
                </h2>

                <p className="mt-2 max-w-xl text-xs leading-5 text-creator-text/45">
                  These details will be included in the message sent to the
                  creator.
                </p>
              </div>

              <button
                onClick={() => setShowOrderForm(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-creator-bg text-creator-text/50 transition hover:bg-neutral-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <InputField
                label="Full name"
                name="name"
                value={customer.name}
                onChange={handleInputChange}
                placeholder="Your full name"
              />

              <InputField
                label="Mobile number"
                name="mobile"
                value={customer.mobile}
                onChange={handleInputChange}
                placeholder="Your mobile number"
                inputMode="numeric"
              />

              <InputField
                label="Alternative mobile"
                name="alternateMobile"
                value={customer.alternateMobile}
                onChange={handleInputChange}
                placeholder="Optional"
                inputMode="numeric"
              />

              <InputField
                label="Street / locality"
                name="street"
                value={customer.street}
                onChange={handleInputChange}
                placeholder="Street, locality"
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-creator-text/45">
                  Complete address
                </label>

                <textarea
                  name="address"
                  value={customer.address}
                  onChange={handleInputChange}
                  placeholder="House no., area, landmark, city, state, pincode..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-creator-text/10 bg-creator-bg px-4 py-3 text-xs outline-none transition focus:border-creator-pink focus:bg-white"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-creator-bg p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
                  <Check size={15} />
                </div>

                <p className="text-[10px] leading-5 text-creator-text/55">
                  Your information will be sent directly to the creator through
                  WhatsApp. Jhankoo does not process payment.
                </p>
              </div>

              <button
                onClick={openOrderPreview}
                className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Review Order
                <ArrowRight size={15} />
              </button>
            </div>
          </section>
        )}
      </main>

      {/* =====================================================
          MESSAGE PREVIEW MODAL
      ===================================================== */}

      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-3 backdrop-blur-[3px] sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[30px] bg-white p-6 shadow-2xl sm:p-7">
            {/* Header */}

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-caveat text-lg text-creator-pink">
                  before you send ♡
                </p>

                <h2 className="font-serif text-2xl font-semibold">
                  Review your message
                </h2>
              </div>

              <button
                onClick={() => setShowPreview(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-creator-bg text-creator-text/50 transition hover:bg-neutral-100"
              >
                <X size={16} />
              </button>
            </div>

            {/* Preview */}

            <div className="mt-6">
              <MessagePreviewBox
                message={
                  messageType === "order"
                    ? createOrderMessage()
                    : createQueryMessage()
                }
              />
            </div>

            {/* PRODUCT SUBTOTAL + SHIPPING CONFIRMATION */}

            {messageType === "order" && (
              <div className="mt-4 rounded-2xl bg-creator-bg px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-creator-text/50">
                    Product subtotal
                  </span>

                  <strong className="font-serif text-xl">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </strong>
                </div>

                <p className="mt-2 text-[10px] leading-5 text-creator-text/55">
                  Shipping and final payable amount will be confirmed by the
                  seller on WhatsApp before the order is confirmed.
                </p>
              </div>
            )}

            {/* Send options */}

            <div className="mt-6">
              <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-creator-text/40">
                Send via
              </p>

              <div className="grid gap-2">
                {whatsappNumber && (
                  <button
                    onClick={() => {
                      sendWhatsApp();
                      setShowPreview(false);
                    }}
                    className="flex items-center justify-between rounded-2xl bg-[#25D366] px-5 py-4 text-left text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle size={20} />

                      <div>
                        <p className="text-sm font-semibold">WhatsApp</p>

                        <p className="text-[10px] text-white/75">
                          Message opens ready to send
                        </p>
                      </div>
                    </div>

                    <ArrowRight size={16} />
                  </button>
                )}

                {instagramLink && (
                  <button
                    onClick={() => {
                      sendInstagram();
                      setShowPreview(false);
                    }}
                    className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={instagramImg}
                        alt="Instagram"
                        loading="lazy"
                        fetchPriority="low"
                        decoding="async"
                        className="h-5 w-5"
                      />

                      <div>
                        <p className="text-sm font-semibold">Instagram</p>

                        <p className="text-[10px] text-neutral-400">
                          Copy message &amp; open profile
                        </p>
                      </div>
                    </div>

                    <ArrowRight size={16} />
                  </button>
                )}

                {facebookLink && (
                  <button
                    onClick={() => {
                      sendFacebook();
                      setShowPreview(false);
                    }}
                    className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={facebookImg}
                        alt="Facebook"
                        loading="lazy"
                        fetchPriority="low"
                        decoding="async"
                        className="h-5 w-5"
                      />

                      <div>
                        <p className="text-sm font-semibold">Facebook</p>

                        <p className="text-[10px] text-neutral-400">
                          Copy message &amp; open page
                        </p>
                      </div>
                    </div>

                    <ArrowRight size={16} />
                  </button>
                )}

                {!hasContactLinks && (
                  <p className="rounded-2xl bg-creator-bg px-4 py-3 text-center text-xs text-creator-text/50">
                    This creator has not added any contact links yet.
                  </p>
                )}
              </div>
            </div>

            <p className="mt-5 text-center text-[9px] leading-4 text-neutral-400">
              Jhankoo doesn&apos;t process your payment. The creator will
              confirm availability, delivery charges and the final payable
              amount with you.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================================
// INPUT FIELD
// ==========================================================

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  inputMode,
}) => {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-creator-text/45">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        className="w-full rounded-2xl border border-creator-text/10 bg-creator-bg px-4 py-3.5 text-xs outline-none transition focus:border-creator-pink focus:bg-white"
      />
    </div>
  );
};

// ==========================================================
// MESSAGE PREVIEW
// ==========================================================

const MessagePreviewBox = ({ message, compact = false }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-creator-text/10 bg-[#f7f7f5]">
      <div className="flex items-center gap-2 border-b border-creator-text/10 bg-white px-4 py-3">
        <MessageCircle size={14} />

        <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-creator-text/50">
          Message preview
        </span>
      </div>

      <div
        className={`whitespace-pre-wrap px-4 py-4 text-xs leading-6 text-creator-text/70 ${
          compact
            ? "max-h-52 overflow-y-auto"
            : "max-h-72 overflow-y-auto"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

// ==========================================================
// CONTACT BUTTON
// ==========================================================

const ContactButton = ({ icon: Icon, label, available, onClick }) => {
  return (
    <button
      disabled={!available}
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-full border border-creator-text/10 bg-white px-3 py-3 text-[10px] font-semibold transition hover:-translate-y-0.5 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-30"
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  );
};

export default Cart;
