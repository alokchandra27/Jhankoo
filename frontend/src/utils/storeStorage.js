// ============================================================
// JHANKOO CUSTOMER STORAGE
// Cart + Wishlist are store specific
// ============================================================

const getStoreKey = (storeName) => {
  if (!storeName) return "unknown-store";

  return String(storeName)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
};

// ============================================================
// CART
// ============================================================

export const getCartKey = (storeName) => {
  return `jhankoo_cart_${getStoreKey(storeName)}`;
};

export const getCart = (storeName) => {
  try {
    const saved = localStorage.getItem(getCartKey(storeName));
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error reading cart:", error);
    return [];
  }
};

export const saveCart = (storeName, cart) => {
  localStorage.setItem(
    getCartKey(storeName),
    JSON.stringify(cart)
  );
  window.dispatchEvent(new Event("jhankoo-shopping-updated"));
};

export const addToCartStorage = (storeName, product) => {
  const cart = getCart(storeName);

  const existingIndex = cart.findIndex(
    (item) => item._id === product._id
  );

  if (existingIndex !== -1) {
    const existing = cart[existingIndex];

    const maxStock =
      existing.stocks !== undefined &&
      existing.stocks !== null
        ? Number(existing.stocks)
        : Infinity;

    if (existing.quantity < maxStock) {
      existing.quantity += 1;
    }
  } else {
    cart.push({
      _id: product._id,

      productName: product.productName,
      productDescription: product.productDescription,
      productPrice: Number(product.productPrice || 0),

      productImage1: product.productImage1,
      productImage2: product.productImage2,
      productImage3: product.productImage3,
      productImage4: product.productImage4,

      category: product.category,
      stocks: product.stocks,
      size: product.size,
      color: product.color,
      customization: product.customization,

      sellerUsername: product.sellerUsername,
      storeName: product.storeName,

      quantity: 1,
    });
  }

  saveCart(storeName, cart);

  return cart;
};

export const updateCartQuantity = (
  storeName,
  productId,
  quantity
) => {
  const cart = getCart(storeName);

  const updatedCart = cart
    .map((item) => {
      if (item._id !== productId) return item;

      let newQuantity = Number(quantity);

      if (newQuantity < 1) {
        newQuantity = 1;
      }

      if (
        item.stocks !== undefined &&
        item.stocks !== null
      ) {
        newQuantity = Math.min(
          newQuantity,
          Number(item.stocks)
        );
      }

      return {
        ...item,
        quantity: newQuantity,
      };
    })
    .filter((item) => item.quantity > 0);

  saveCart(storeName, updatedCart);

  return updatedCart;
};

export const removeFromCart = (
  storeName,
  productId
) => {
  const cart = getCart(storeName);

  const updatedCart = cart.filter(
    (item) => item._id !== productId
  );

  saveCart(storeName, updatedCart);

  return updatedCart;
};

export const clearCart = (storeName) => {
  localStorage.removeItem(getCartKey(storeName));
  window.dispatchEvent(new Event("jhankoo-shopping-updated"));
};

// ============================================================
// WISHLIST
// ============================================================

export const getWishlistKey = (storeName) => {
  return `creatorly_wishlist_${getStoreKey(storeName)}`;
};

export const getWishlist = (storeName) => {
  try {
    const saved = localStorage.getItem(
      getWishlistKey(storeName)
    );

    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error reading wishlist:", error);
    return [];
  }
};

export const saveWishlist = (
  storeName,
  wishlist
) => {
  localStorage.setItem(
    getWishlistKey(storeName),
    JSON.stringify(wishlist)
  );
};

export const toggleWishlistStorage = (
  storeName,
  product
) => {
  const wishlist = getWishlist(storeName);

  const exists = wishlist.some(
    (item) => item._id === product._id
  );

  let updatedWishlist;

  if (exists) {
    updatedWishlist = wishlist.filter(
      (item) => item._id !== product._id
    );
  } else {
    updatedWishlist = [
      ...wishlist,
      {
        _id: product._id,

        productName: product.productName,
        productDescription:
          product.productDescription,
        productPrice: Number(
          product.productPrice || 0
        ),

        productImage1: product.productImage1,
        productImage2: product.productImage2,
        productImage3: product.productImage3,
        productImage4: product.productImage4,

        category: product.category,
        stocks: product.stocks,
        size: product.size,
        customization:
          product.customization,

        sellerUsername:
          product.sellerUsername,
        storeName: product.storeName,
      },
    ];
  }

  saveWishlist(
    storeName,
    updatedWishlist
  );

  return {
    wishlist: updatedWishlist,
    added: !exists,
  };
};

export const removeFromWishlist = (
  storeName,
  productId
) => {
  const wishlist = getWishlist(storeName);

  const updatedWishlist =
    wishlist.filter(
      (item) => item._id !== productId
    );

  saveWishlist(
    storeName,
    updatedWishlist
  );

  return updatedWishlist;
};