import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getWishlist,
  removeFromWishlist,
  addToCartStorage,
} from "../utils/storeStorage";

const getImageUrl = (image) => {
  if (!image) return "";

  if (typeof image === "string") {
    return image;
  }

  return image?.url || "";
};

const Wishlist = () => {
  const navigate = useNavigate();
  const { username: storeName } = useParams();

  const [wishlist, setWishlist] =
    useState([]);

  useEffect(() => {
    setWishlist(
      getWishlist(storeName)
    );
  }, [storeName]);

  const removeItem = (productId) => {
    const updated =
      removeFromWishlist(
        storeName,
        productId
      );

    setWishlist(updated);
  };

  const moveToCart = (product) => {
    addToCartStorage(
      storeName,
      product
    );

    removeItem(product._id);

    navigate(
      `/publicstore/${encodeURIComponent(
        storeName
      )}/cart`
    );
  };

  return (
    <div className="min-h-screen bg-creator-bg-butter text-creator-text">

      <main className="mx-auto w-[calc(100%-24px)] max-w-6xl px-1 pb-20 pt-8 sm:w-[calc(100%-48px)]">

        {/* HEADER */}

        <div className="mb-9 flex items-center justify-between">

          <button
            onClick={() =>
              navigate(
                `/publicstore/${encodeURIComponent(
                  storeName
                )}`
              )
            }
            className="flex items-center gap-2 text-xs text-creator-text/60 transition hover:text-creator-text"
          >
            <ArrowLeft size={16} />
            Continue shopping
          </button>

          <div className="text-right">
            <p className="font-caveat text-lg text-creator-pink">
              little things you love ♡
            </p>

            <h1 className="font-serif text-3xl font-semibold">
              Wishlist
            </h1>
          </div>

        </div>

        {/* EMPTY */}

        {wishlist.length === 0 ? (
          <section className="flex min-h-[60vh] items-center justify-center">

            <div className="w-full max-w-md rounded-[28px] border border-creator-text/10 bg-white/80 px-6 py-14 text-center shadow-sm">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-creator-accent/40">
                <Heart
                  size={30}
                  strokeWidth={1.5}
                />
              </div>

              <p className="mt-6 font-caveat text-xl text-creator-pink">
                save something special
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold">
                Your wishlist is empty
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-creator-text/50">
                Tap the heart on products you
                love and they'll stay here for
                later.
              </p>

              <button
                onClick={() =>
                  navigate(
                    `/publicstore/${encodeURIComponent(
                      storeName
                    )}`
                  )
                }
                className="mt-7 rounded-full bg-creator-text px-6 py-3 text-xs font-semibold text-white transition hover:-translate-y-1 hover:bg-creator-primary"
              >
                Explore collection
              </button>

            </div>

          </section>
        ) : (

          <section>

            <div className="mb-5 flex items-center justify-between">

              <p className="text-xs text-creator-text/45">
                {wishlist.length} saved{" "}
                {wishlist.length === 1
                  ? "piece"
                  : "pieces"}
              </p>

            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">

              {wishlist.map((product, index) => (

                <article
                  key={product._id}
                  className="group overflow-hidden rounded-[20px] border border-creator-text/10 bg-white shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(60,50,40,0.10)]"
                >

                  {/* IMAGE */}

                  <div
                    onClick={() =>
                      navigate(
                        `/productDetails/${product._id}`
                      )
                    }
                    className="relative aspect-[0.92] cursor-pointer overflow-hidden bg-creator-bg"
                  >

                    <img
                      src={getImageUrl(
                        product.productImage1
                      )}
                      alt={product.productName}
                      loading={index < 2 ? "eager" : "lazy"}
                      decoding="async"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        removeItem(
                          product._id
                        );
                      }}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-creator-text shadow-sm backdrop-blur transition hover:scale-110 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>

                  </div>

                  {/* INFO */}

                  <div className="p-4">

                    <span className="rounded-full bg-creator-accent/30 px-2 py-1 text-[8px] uppercase tracking-wider text-creator-text/55">
                      {product.category ||
                        "Handmade"}
                    </span>

                    <h2 className="mt-3 truncate font-serif text-base font-semibold">
                      {product.productName}
                    </h2>

                    <div className="mt-4 flex items-center justify-between">

                      <strong className="font-serif text-lg">
                        ₹
                        {Number(
                          product.productPrice
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <button
                        onClick={() =>
                          moveToCart(product)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-creator-text text-white transition hover:scale-110 hover:bg-creator-primary active:scale-90"
                        title="Move to cart"
                      >
                        <ShoppingCart
                          size={15}
                        />
                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          </section>
        )}

      </main>
    </div>
  );
};

export default Wishlist;