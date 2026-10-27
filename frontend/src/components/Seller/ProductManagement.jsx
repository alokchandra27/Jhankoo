import React, { useEffect, useMemo, useState } from "react";
import API from "../API/API";
import { useNavigate } from "react-router-dom";
import { Plus, Search, SlidersHorizontal, Package, Pencil, Trash2, ArrowUpRight, Sparkles, Palette, X, ChevronDown, ImagePlus, Loader2 } from "lucide-react";
import processAndCompressImage from "./ProcessAndCompressImage";
import bluecolorImg from "../../assets/bluecolor.webp";

export default function ProductsManagement() {
  const [activeTab, setActiveTab] = useState("list");

  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    shippingAvailable: false,
    shippingCost: "",
    shippingIncluded: false,
    category: "Other",
    stocks: "",
    color: "",
    size: "",
    extraDetails: "",
    customization: false,
  });

  const [images, setImages] = useState({
    productImage1: null,
    productImage2: null,
    productImage3: null,
    productImage4: null,
  });

  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  const [mockProducts, setMockProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [isLoading, setIsLoading] = useState(true);

  const categories = ["all", "clay", "resin", "wood", "metal", "fabric", "crochet", "3d-printing", "handmade", "petal", "Other"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = async (e, imageField) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    const compressedFile = await processAndCompressImage(file);

    if (compressedFile.size > 5 * 1024 * 1024) {
      alert("Each image must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }

    setImages((previousImages) => ({
      ...previousImages,
      [imageField]: compressedFile,
    }));
  };

  const removeImage = (imageField) => {
    setImages((previousImages) => ({
      ...previousImages,
      [imageField]: null,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!images.productImage1) {
      alert("Please add the main product image.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      Object.entries(images).forEach(([key, file]) => {
        if (file) payload.append(key, file);
      });

      const response = await API.post("/api/products/create-product", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMockProducts((previousProducts) => [response.data.product, ...previousProducts]);
      setFormData({
        productName: "",
        productDescription: "",
        productPrice: "",
        shippingAvailable: false,
        shippingCost: "",
        shippingIncluded: false,
        category: "clay",
        stocks: "",
        color: "",
        size: "",
        extraDetails: "",
        customization: false,
      });
      setImages({
        productImage1: null,
        productImage2: null,
        productImage3: null,
        productImage4: null,
      });
      setActiveTab("list");
    } catch (error) {
      console.error("Create product error:", error);
      alert(error?.response?.data?.message || "Failed to create product.");
    } finally {
      setIsSaving(false);
    }
  };

  const editProduct = (productId) => {
    navigate(`/products/edit/${productId}`);
  };

  const deleteHandler = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await API.delete(`/api/products/${productId}`);
      setMockProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Delete product error:", error);
      alert(error?.response?.data?.message || "Failed to delete product.");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const response = await API.get("/api/products");

        // console.log("API Response:", response.data);

        setMockProducts(response.data.products || []);
      } catch (error) {
        if (error.response) {
          console.error("API Error Response:", error.response.data);
        } else {
          console.error("API Error:", error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    if (search.trim()) {
      const query = search.toLowerCase();

      products = products.filter((product) =>
        [product.productName, product.productDescription, product.category, product.color, product.sellerUsername, product.storeName]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query)),
      );
    }

    if (category !== "all") {
      products = products.filter((product) => String(product.category).toLowerCase() === category.toLowerCase());
    }

    if (sortBy === "price-low") {
      products.sort((a, b) => Number(a.productPrice) - Number(b.productPrice));
    }

    if (sortBy === "price-high") {
      products.sort((a, b) => Number(b.productPrice) - Number(a.productPrice));
    }

    if (sortBy === "stock-low") {
      products.sort((a, b) => Number(a.stocks || 0) - Number(b.stocks || 0));
    }

    if (sortBy === "latest") {
      products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return products;
  }, [mockProducts, search, category, sortBy]);

  const totalProducts = mockProducts.length;

  const inStock = mockProducts.filter((product) => Number(product.stocks) > 0).length;

  const customizable = mockProducts.filter((product) => product.customization === true).length;

  return (
    <div className="min-h-screen bg-creator-bg text-creator-text antialiased">
      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <section className="mb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px w-7 bg-creator-pink" />

                <span className="font-sans-serif text-lg text-creator-pink">My little collection</span>
              </div>

              <h1 className="font-sans-serif text-3xl font-semibold tracking-tight text-neutral-800 sm:text-4xl">
                Products          </h1>

              <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500 font-sans sm:text-basecd frontendcd">
                Everything I create all in one place. Easy to manage, ready to grow.
              </p>
            </div>

            {/* Add Product */}
            <button
              onClick={() => setActiveTab("add")}
              className="group inline-flex w-fit items-center gap-2 bg-creator-text px-5 py-3 text-xs font-semibold tracking-wide text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-neutral-800 hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <Plus size={16} className="transition-transform duration-300 group-hover:rotate-90" />
              Add Product
            </button>
          </div>

          {/* =================================================
              MINI STATS
          ================================================== */}

          <div className="mt-7 grid grid-cols-3 gap-2 sm:max-w-xl sm:gap-3">
            <StatCard icon={<Package size={15} />} number={totalProducts} label="Products" />

            <StatCard icon={<Sparkles size={15} />} number={inStock} label="In stock" />

            <StatCard icon={<Palette size={15} />} number={customizable} label="Custom" />
          </div>
        </section>

        {/* =====================================================
            TABS
        ====================================================== */}

        <div className="mb-6 flex items-center justify-between border-b border-neutral-200/70">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("list")}
              className={`relative pb-3 text-xs font-semibold transition-colors duration-300 ${activeTab === "list" ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-700"}`}
            >
              All Products
              {activeTab === "list" && <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-creator-pink" />}
            </button>

            <button
              onClick={() => setActiveTab("add")}
              className={`relative pb-3 text-xs font-semibold transition-colors duration-300 ${activeTab === "add" ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-700"}`}
            >
              Add New
              {activeTab === "add" && <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-creator-pink" />}
            </button>
          </div>

          {activeTab === "list" && <span className="hidden pb-3 text-[10px] text-neutral-400 sm:block">{filteredProducts.length} showing</span>}
        </div>

        {/* =====================================================
            PRODUCT LIST
        ====================================================== */}

        {activeTab === "list" && (
          <section>
            {/* Search + filters */}
            <div className="mb-7 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search your products..."
                  className="w-full rounded-full border border-neutral-200 bg-white/70 py-3 pl-11 pr-10 text-xs outline-none transition-all duration-300 placeholder:text-neutral-400 focus:border-creator-pink focus:bg-white focus:ring-4 focus:ring-creator-pink/10"
                />

                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700">
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="flex w-full gap-2 overflow-x-auto pb-1 lg:w-auto">
                <div className="relative shrink-0">
                  <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="appearance-none rounded-full border border-neutral-200 bg-white py-2.5 pl-9 pr-9 text-[11px] font-medium capitalize outline-none transition hover:border-neutral-300 focus:border-creator-pink"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item === "all" ? "All categories" : item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>

                <div className="relative shrink-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none rounded-full border border-neutral-200 bg-white py-2.5 pl-4 pr-9 text-[11px] font-medium outline-none transition hover:border-neutral-300 focus:border-creator-pink"
                  >
                    <option value="latest">Latest</option>
                    <option value="price-low">Price: Low</option>
                    <option value="price-high">Price: High</option>
                    <option value="stock-low">Low Stock</option>
                  </select>

                  <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>
              </div>
            </div>

            {/* Products */}
            {isLoading ? (
              <ProductSkeleton />
            ) : filteredProducts.length === 0 ? (
              <EmptyProducts
                hasProducts={mockProducts.length > 0}
                onAdd={() => setActiveTab("add")}
                onClear={() => {
                  setSearch("");
                  setCategory("all");
                }}
              />
            ) : (
              <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product._id} product={product} index={index} onEdit={editProduct} onDelete={deleteHandler} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            ADD PRODUCT
        ====================================================== */}

        {activeTab === "add" && (
          <AddProductForm
            formData={formData}
            images={images}
            isSaving={isSaving}
            handleInputChange={handleInputChange}
            handleImageChange={handleImageChange}
            removeImage={removeImage}
            handleFormSubmit={handleFormSubmit}
            onCancel={() => setActiveTab("list")}
          />
        )}
      </main>
    </div>
  );
}

/* =============================================================
   STAT CARD
============================================================= */

function StatCard({ icon, number, label }) {
  return (
    <div className="group rounded-2xl border border-neutral-200/70 bg-white/60 p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-sm">
      <div className="flex items-center gap-2 text-neutral-400">
        {icon}

        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>

      <p className="mt-1 font-serif text-xl font-semibold text-neutral-800">{number}</p>
    </div>
  );
}

/* =============================================================
   PRODUCT CARD
============================================================= */

function ProductCard({ product, index, onEdit, onDelete }) {
  const image = product?.productImage1?.url || bluecolorImg;

  const stock = Number(product?.stocks || 0);

  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <article
      className="group relative transition-all duration-500 hover:-translate-y-1.5"
      style={{
        animation: `creatorlyCardIn 0.55s ease ${index * 70}ms both`,
      }}
    >
      {/* Image */}
      <div className="relative aspect-[4/4.4] overflow-hidden rounded-[10px] bg-neutral-100 shadow-sm transition-all duration-500 group-hover:shadow-xl ">
        <img src={image} alt={product.productName} loading={index < 2 ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" />

        {/* Soft image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Category */}
        {product.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-neutral-600 shadow-sm backdrop-blur transition-transform duration-300 group-hover:-translate-y-0.5">
            {product.category}
          </span>
        )}

        {/* Custom badge */}
        {product.customization && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-[#1A2E26]/90 px-3 py-1.5 text-[9px] font-medium text-white backdrop-blur">
            <Sparkles size={10} />
            Customizable
          </span>
        )}

        {/* Stock */}
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-[9px] font-semibold backdrop-blur ${isOutOfStock ? "bg-red-50/95 text-red-600" : isLowStock ? "bg-amber-50/95 text-amber-700" : "bg-white/90 text-emerald-700"}`}
        >
          {isOutOfStock ? "Out of stock" : isLowStock ? `${stock} left` : "In stock"}
        </span>

        {/* Hover action */}
        <button
          className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-3 items-center justify-center rounded-full bg-white text-neutral-700 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110"
          title="View product"
        >
          <ArrowUpRight onClick={() => onEdit(product._id)} size={15} className="cursor-pointer" />
        </button>
      </div>

      {/* Content */}
      <div className="px-1 pt-3 font-sans-serif">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-sans text-base font-semibold capitalize text-neutral-800">{product.productName}</h3>

            <p className="mt-1 line-clamp-1 text-[13px] text-neutral-400">{product.productDescription || "Handmade with care."}</p>
          </div>

          <p className="shrink-0 font-serif text-base font-semibold text-neutral-800">₹{Number(product.productPrice || 0).toLocaleString("en-IN")}</p>
        </div>

        {/* Details */}
        <div className="mt-3 flex items-center gap-2 text-[12px] text-neutral-400">
          {product.color && (
            <>
              <span>{product.color}</span>
              <span>•</span>
            </>
          )}

          {product.size && (
            <>
              <span>{product.size}</span>
              <span>•</span>
            </>
          )}

          <span>{stock} stock</span>
          
        </div>

        <span className="mt-3 block text-[11px] text-neutral-400 text-red-500">
          {product.extraDetails?.trim() || "No extra details"}
        </span>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-4 border-t border-neutral-200/70 pt-3">
          <button onClick={() => onEdit(product._id)} className="flex items-center gap-1.5 text-[10px] font-semibold text-neutral-600 transition-colors hover:text-creator-pink cursor-pointer">
            <Pencil size={12} />
            Edit
          </button>

          <button onClick={() => onDelete(product._id)} className="flex items-center gap-1.5 text-[10px] font-semibold text-neutral-400 transition-colors hover:text-red-500 active:scale-95 cursor-pointer">
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

/* =============================================================
   EMPTY STATE
============================================================= */

function EmptyProducts({ hasProducts, onAdd, onClear }) {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center rounded-[28px] border border-dashed border-neutral-300 bg-white/40 px-6 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-creator-pink/10 text-creator-pink">{hasProducts ? <Search size={25} /> : <Package size={25} />}</div>

      <h3 className="font-serif text-xl font-semibold text-neutral-800">{hasProducts ? "Nothing found." : "Your collection is empty."}</h3>

      <p className="mt-2 max-w-sm text-xs leading-5 text-neutral-400">{hasProducts ? "Try another search term or category." : "Add your first product and start building your little storefront."}</p>

      <div className="mt-5 flex gap-2">
        {hasProducts && (
          <button onClick={onClear} className=" border border-neutral-200 bg-white px-4 py-2.5 text-[11px] font-semibold transition hover:bg-neutral-50 cursor-pointer">
            Clear filters
          </button>
        )}

        <button onClick={onAdd} className=" bg-creator-text px-5 py-2.5 text-[11px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 cursor-pointer">
          Add Product
        </button>
      </div>
    </div>
  );
}

/* =============================================================
   LOADING SKELETON
============================================================= */

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="animate-pulse">
          <div className="aspect-[4/4.4] rounded-[22px] bg-neutral-200/70" />

          <div className="px-1 pt-4">
            <div className="h-4 w-2/3 rounded bg-neutral-200/70" />

            <div className="mt-2 h-3 w-full rounded bg-neutral-200/50" />

            <div className="mt-3 h-3 w-1/2 rounded bg-neutral-200/50" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* =============================================================
   ADD PRODUCT FORM
============================================================= */

function AddProductForm({ formData, images, isSaving, handleInputChange, handleImageChange, removeImage, handleFormSubmit, onCancel }) {
  return (
    <form onSubmit={handleFormSubmit} className="overflow-hidden rounded-[28px] border border-neutral-200/70 bg-white/70 shadow-sm">
      {/* Form Header */}
      <div className="border-b border-neutral-200/70 px-5 py-6 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-px w-6 bg-creator-pink" />

              <span className="font-sans-serif text-base text-creator-pink">add something new</span>
            </div>

            <h2 className="font-serif text-2xl font-semibold text-neutral-800">
              Create a product<span className="text-creator-pink">.</span>
            </h2>

            <p className="mt-1 text-xs text-neutral-400 font-sans-serif">Give your creation a little space to shine.</p>
          </div>

          <div className="hidden h-11 w-11 items-center justify-center rounded-full bg-creator-pink/10 text-creator-pink sm:flex">
            <Sparkles size={18} />
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 gap-5 p-5 sm:p-8 md:grid-cols-2 font-sans-serif">
        {/* Name */}
        <Field label="Product Name" required className="md:col-span-2 text-creator-text">
          <input required type="text" name="productName" value={formData.productName} onChange={handleInputChange} placeholder="Beautiful Clay Turtle" className="creator-input border border-black/20 bg-white/50 p-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-creator-pink" />
        </Field>

        {/* SHIPPING — temporarily disabled */}
        {/*
        <div className="md:col-span-2 rounded-2xl border border-black/[0.06] bg-black/[0.02] p-4">
          ...
        </div>
        */}

        {/* Description */}
        <Field label="Description" required className="md:col-span-2">
          <textarea
            required
            rows="4"
            name="productDescription"
            value={formData.productDescription}
            onChange={handleInputChange}
            placeholder="Tell people what makes this creation special..."
            className="creator-input resize-none border border-black/20 bg-white/50 p-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-creator-pink"
          />
        </Field>

        {/* Price */}
        <Field label="Price" required>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">₹</span>

            <input required type="number" name="productPrice" value={formData.productPrice} onChange={handleInputChange} placeholder="499" className="creator-input pl-8 border border-black/20 bg-white/50 p-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-creator-pink" />
          </div>
        </Field>

        {/* Stock */}
        <Field label="Available Stock" required>
          <input required type="number" name="stocks" value={formData.stocks} onChange={handleInputChange} placeholder="20" className="creator-input border border-black/20 bg-white/50 p-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-creator-pink" />
        </Field>

        {/* Category */}
        <Field label="Category">
          <select name="category" value={formData.category} onChange={handleInputChange} className="creator-input capitalize border border-black/20 bg-white/50 p-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-creator-pink">
            <option value="clay">Clay</option>
            <option value="resin">Resin</option>
            <option value="wood">Wood</option>
            <option value="metal">Metal</option>
            <option value="fabric">Fabric</option>
            <option value="crochet">Crochet</option>
            <option value="3d-printing">3D Printing</option>
            <option value="handmade">Handmade</option>
            <option value="petal">Petal</option>
            <option value="Other">Other</option>
          </select>
        </Field>

        {/* Color */}
        <Field label="Color">
          <input type="text" name="color" value={formData.color} onChange={handleInputChange} placeholder="Green / Earthy Brown" className="creator-input border border-black/20 bg-white/50 p-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-creator-pink" />
        </Field>

        {/* Size */}
        <Field label="Size">
          <input type="text" name="size" value={formData.size} onChange={handleInputChange} placeholder="10cm × 12cm" className="creator-input border border-black/20 bg-white/50 p-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-creator-pink" />
        </Field>

        {/* Extra Details */}
        <Field label="Extra Details" className="md:col-span-2">
          <textarea
            rows="3"
            name="extraDetails"
            value={formData.extraDetails}
            onChange={handleInputChange}
            placeholder="Bulk order available at 10+ units + pricing. Materials, care instructions, or anything customers should know..."
            className="creator-input resize-none border border-black/20 bg-white/50 p-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-creator-pink"
          />
        </Field>

        {/* Images */}
        <div className="md:col-span-2 rounded-3xl border border-neutral-200/80 bg-neutral-50/70 p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-600">Product images</p>
              <p className="mt-1 text-xs leading-5 text-neutral-400">Add one main image and up to three additional views.</p>
            </div>

            <span className="w-fit rounded-full bg-creator-pink/10 px-3 py-1 text-[10px] font-semibold text-creator-pink">Main image required</span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {["productImage1", "productImage2", "productImage3", "productImage4"].map((imageField, index) => {
              const file = images[imageField];

              return (
                <div key={imageField} className={`relative rounded-2xl border border-dashed p-4 transition-colors ${file ? "border-creator-pink/50 bg-white" : "border-neutral-300 bg-white/60 hover:border-creator-pink/50"}`}>
                  <label className="flex cursor-pointer items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-creator-pink/10 text-creator-pink">
                      <ImagePlus size={18} />
                    </span>

                    <span className="min-w-0">
  {/* Label: Main image or Sub images */}
  <span className="block text-xs font-semibold text-neutral-700">
    {index === 0 ? "Main image" : `Image ${index + 1}`}
  </span>
  
  {/* Subtext: Dynamic Size handler + Acceptable Formats */}
  <span className="mt-1 block truncate text-[10px] text-neutral-400">
    {file ? (
      // 🚀 DYNAMIC SIZE: Agar file 1MB se choti hai toh KB dikhayega, badi hai toh MB dikhayega
      file.size < 1024 * 1024 
        ? `${file.name} (${(file.size / 1024).toFixed(0)} KB)` 
        : `${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)`
    ) : (
      // Format text standard placeholder
      "JPG, PNG, or WEBP"
    )}
  </span>
</span>


                    <input type="file" accept="image/*" required={index === 0} onChange={(e) => handleImageChange(e, imageField)} className="sr-only" />
                  </label>

                  {file && (
                    <button type="button" onClick={() => removeImage(imageField)} className="absolute right-3 top-3 rounded-full p-1 text-neutral-400 transition hover:bg-red-50 hover:text-red-500" aria-label={`Remove ${index === 0 ? "main image" : `image ${index + 1}`}`}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-[10px] leading-4 text-amber-800">
            ImageKit free tier note: each image must be 5 MB or smaller. Please upload only up to 4 optimized product images to keep storage and bandwidth under control.
          </p> */}
        </div>

        {/* Customization */}
        <label className="md:col-span-2 group flex cursor-pointer items-center gap-4 rounded-2xl border border-neutral-200 bg-creator-bg-butter/60 p-4 transition-all duration-300 hover:border-creator-pink/40 hover:bg-creator-pink/5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-creator-pink shadow-sm transition-transform duration-300 group-hover:scale-110">
            <Palette size={17} />
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold text-neutral-700">Accept custom requests</p>

            <p className="mt-0.5 text-[10px] leading-4 text-neutral-400">Let customers request names, colours, notes or other changes.</p>
          </div>

          <input type="checkbox" name="customization" checked={formData.customization} onChange={handleInputChange} className="h-4 w-4 accent-creator-pink" />
        </label>
      </div>

      {/* Footer */}
      <div className="flex flex-col-reverse gap-3 border-t border-neutral-200/70 px-5 py-5 sm:flex-row sm:justify-end sm:px-8">
        <button
          type="button"
          onClick={onCancel}
          className=" border border-neutral-200 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-50 cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="group inline-flex items-center justify-center gap-2 bg-creator-text cursor-pointer px-6 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Product"}
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
        </button>
      </div>
    </form>
  );
}

/* =============================================================
   FIELD
============================================================= */

function Field({ label, required, className = "", children }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        {label}

        {required && <span className="ml-1 text-creator-pink">*</span>}
      </label>

      {children}
    </div>
  );
}
