import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, ImagePlus, X, Package, Palette, Ruler, Sparkles, Loader2, ReceiptText } from "lucide-react";
import { toast } from "react-toastify";
import API from "../API/API";
import processAndCompressImage from "./ProcessAndCompressImage";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    shippingAvailable: false,
    shippingCost: "",
    shippingIncluded: false,
    category: "other",
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

  const [existingImages, setExistingImages] = useState({
    productImage1: null,
    productImage2: null,
    productImage3: null,
    productImage4: null,
  });

  // =========================
  // FETCH PRODUCT
  // =========================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await API.get(`/api/products/${productId}`);

        const product = response.data.product || response.data;

        setFormData({
          productName: product.productName || "",
          productDescription: product.productDescription || "",
          productPrice: product.productPrice ?? "",
          shippingAvailable: product.shippingAvailable || false,
          shippingCost: product.shippingCost ?? "",
          shippingIncluded: product.shippingIncluded || false,
          category: product.category || "other",
          stocks: product.stocks ?? "",
          color: product.color || "",
          size: product.size || "",
          customization: product.customization || false,
          extraDetails: product.extraDetails || "",
        });

        setExistingImages({
          productImage1: product.productImage1?.url || null,
          productImage2: product.productImage2?.url || null,
          productImage3: product.productImage3?.url || null,
          productImage4: product.productImage4?.url || null,
        });
      } catch (error) {
        console.error("Fetch product error:", error);

        toast.error(error?.response?.data?.message || "Unable to load product.");

        navigate("/products");
      } finally {
        setLoading(false);
        toast.dismiss();
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, navigate]);

  // =========================
  // INPUT HANDLER
  // =========================

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // IMAGE HANDLER
  // =========================

  const handleImageChange = async (e, imageField) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    const compressedFile = await processAndCompressImage(file);

    if (compressedFile.size > 5 * 1024 * 1024) {
      toast.error("Image size should be below 5MB.");
      return;
    }

    setImages((prev) => ({
      ...prev,
      [imageField]: compressedFile,
    }));
  };

  const removeNewImage = (imageField) => {
    setImages((prev) => ({
      ...prev,
      [imageField]: null,
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productName.trim()) {
      toast.error("Product name is required.");
      return;
    }

    if (!formData.productDescription.trim()) {
      toast.error("Product description is required.");
      return;
    }

    if (!formData.productPrice) {
      toast.error("Product price is required.");
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append("productName", formData.productName);
      data.append("productDescription", formData.productDescription);
      data.append("productPrice", formData.productPrice);
      data.append("shippingAvailable", false);
      data.append("shippingCost", "");
      data.append("shippingIncluded", false);
      data.append("category", formData.category);
      data.append("stocks", formData.stocks);
      data.append("color", formData.color);
      data.append("size", formData.size);
      data.append("extraDetails", formData.extraDetails);
      data.append("customization", formData.customization);

      Object.entries(images).forEach(([key, file]) => {
        if (file) {
          data.append(key, file);
        }
      });

      await API.put(`/api/products/${productId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product updated successfully!");

      navigate("/products");
    } catch (error) {
      console.error("Update product error:", error);

      toast.error(error?.response?.data?.message || "Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-creator-bg-butter px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-5 w-24 rounded bg-black/5" />

          <div className="mt-8 h-10 w-64 rounded bg-black/5" />
          <div className="mt-3 h-5 w-96 max-w-full rounded bg-black/5" />

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="h-[620px] rounded-[28px] bg-white/70" />
            <div className="h-[620px] rounded-[28px] bg-white/70" />
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // IMAGE SLOT
  // =========================

  const renderImageSlot = (field, index) => {
    const newImage = images[field];
    const existingImage = existingImages[field];

    const preview = newImage ? URL.createObjectURL(newImage) : existingImage;

    return (
      <div
        key={field}
        className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${preview ? "border-black/10 bg-black/[0.03]" : "border-dashed border-black/15 bg-black/[0.02] hover:border-black/30 hover:bg-black/[0.04]"}`}
      >
        {preview ? (
          <>
            <img src={preview} alt={`Product ${index + 1}`} loading={index < 2 ? "eager" : "lazy"} decoding="async" className="h-40 w-full object-cover transition duration-500 group-hover:scale-[1.03]" />

            <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />

            {newImage && (
              <button
                type="button"
                onClick={() => removeNewImage(field)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition hover:scale-105 hover:bg-white"
              >
                <X size={15} />
              </button>
            )}

            {!newImage && (
              <label className="absolute inset-x-2 bottom-2 cursor-pointer rounded-xl bg-white/90 px-3 py-2 text-center text-xs font-medium text-black opacity-0 shadow-sm backdrop-blur-sm transition group-hover:opacity-100">
                Replace image
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, field)} />
              </label>
            )}
          </>
        ) : (
          <label className="flex h-40 cursor-pointer flex-col items-center justify-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
              <ImagePlus size={19} strokeWidth={1.7} />
            </div>

            <p className="text-sm font-medium text-black/70">Add image</p>

            <p className="mt-1 text-[11px] text-black/40">JPG, PNG up to 5MB</p>

            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, field)} />
          </label>
        )}

        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-black/60 shadow-sm">
          {index === 0 ? "Cover" : `Image ${index + 1}`}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-creator-bg px-4 py-7 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <button type="button" onClick={() => navigate("/products")} className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-black/55 transition hover:text-black">
            <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Back to products
          </button>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-medium tracking-wide text-black/45">Jhankoo · Product Studio</p>

              <h1 className="font-caveat text-4xl tracking-tight text-black sm:text-5xl">
                Edit your product<span className="text-black/25">.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-black/55 sm:text-base">Keep your product details fresh, polished and ready for your customers.</p>
            </div>

            <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm sm:flex">
              <Package
              onClick={() => toast.info("Coupon feature coming soon!")}
              size={22} strokeWidth={1.6} className="text-black/65 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.75fr]">
            {/* LEFT */}

            <div className="space-y-6">

              <section className="rounded-[5px] border border-black/[0.06] bg-white/80 p-5 shadow-[0_8px_40px_rgba(0,0,0,0.035)] backdrop-blur-sm sm:p-7">
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/35">01 · Product details</p>

                  <h2 className="mt-2 font-caveat text-2xl text-creator-pink">Tell people about it.</h2>
                </div>

                <div className="space-y-5">
                  {/* NAME */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-creator-accent font-caveat">Product name</label>

                    <input type="text" name="productName" value={formData.productName} onChange={handleInputChange} placeholder="e.g. Handmade Clay Turtle" className="creator-input w-full border border-black/20 bg-white/50 p-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-creator-pink font-caveat" />
                  </div>

                  {/* DESCRIPTION */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-creator-accent font-caveat">Description</label>

                    <textarea
                      name="productDescription"
                      value={formData.productDescription}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Tell customers what makes this product special..."
                      className="creator-input w-full resize-none border border-black/20 bg-white/50 p-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-creator-pink font-caveat"
                    />

                    <p className="mt-2 text-right text-[11px] text-black/35">{formData.productDescription.length} characters</p>
                  </div>

                  {/* PRICE + STOCK */}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-creator-accent font-caveat">Price</label>

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-black/40">₹</span>

                        <input type="number" name="productPrice" value={formData.productPrice} onChange={handleInputChange} min="0" placeholder="499" className="creator-input w-full pl-9 border border-black/20 bg-white/50 p-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-creator-pink font-caveat"  />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-creator-accent font-caveat">Stock</label>

                      <input type="number" name="stocks" value={formData.stocks} onChange={handleInputChange} min="0" placeholder="20" className="creator-input w-full border border-black/20 bg-white/50 p-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-creator-pink font-caveat" />
                    </div>

                    {/* <div className="sm:col-span-2 rounded-2xl border border-black/[0.06] bg-black/[0.02] p-4">
                      <label className="flex cursor-pointer items-start gap-3">
                        <input type="checkbox" name="shippingAvailable" checked={formData.shippingAvailable} onChange={handleInputChange} className="mt-1 h-4 w-4 cursor-pointer accent-black" />
                        <div>
                          <p className="text-sm font-medium text-creator-accent font-caveat">Shipping available</p>
                          <p className="mt-1 text-xs text-black/45">Offer delivery for this product.</p>
                        </div>
                      </label>

                      {formData.shippingAvailable && (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-creator-accent font-caveat">Shipping cost per item</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">₹</span>
                              <input required type="number" min="0" name="shippingCost" value={formData.shippingCost} onChange={handleInputChange} placeholder="0" className="creator-input w-full pl-8 border border-black/20 bg-white/50 p-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-creator-pink font-caveat" />
                            </div>
                          </div>
                          <label className="flex cursor-pointer items-center gap-3 sm:pt-7">
                            <input type="checkbox" name="shippingIncluded" checked={formData.shippingIncluded} onChange={handleInputChange} className="h-4 w-4 cursor-pointer accent-black" />
                            <span className="text-sm text-creator-accent font-caveat">Shipping included in product price</span>
                          </label>
                        </div>
                      )}
                    </div> */}
                  </div>

                  {/* CATEGORY */}

                  <div>
                    <label className="mb-2 block text-sm font-medium  text-creator-accent font-caveat">Category</label>

                    <select name="category" value={formData.category} onChange={handleInputChange} className="creator-input w-full cursor-pointer border border-black/20 bg-white/50 p-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-creator-pink font-caveat">
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
                  </div>
                </div>
              </section>

              {/* EXTRA DETAILS */}

              <section className="rounded-[5px] border border-black/[0.06] bg-white/80 p-5 shadow-[0_8px_40px_rgba(0,0,0,0.035)] backdrop-blur-sm sm:p-7">
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/35">02 · More details</p>

                  <h2 className="mt-2 font-serif text-2xl text-black">Add the little things.</h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* COLOR */}

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-creator-accent font-caveat">
                      <Palette size={15} />
                      Color
                    </label>

                    <input type="text" name="color" value={formData.color} onChange={handleInputChange} placeholder="e.g. Sage green" className="creator-input w-full border border-black/20 bg-white/50 p-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-creator-pink font-caveat" />
                  </div>

                  {/* SIZE */}

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-creator-accent font-caveat">
                      <Ruler size={15} />
                      Size
                    </label>

                    <input type="text" name="size" value={formData.size} onChange={handleInputChange} placeholder="e.g. 10cm" className="creator-input w-full border border-black/20 bg-white/50 p-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-creator-pink font-caveat" />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-creator-accent font-caveat">
                      <ReceiptText size={15} />
                      Extra Details
                    </label>

                    <input type="text" name="extraDetails" value={formData.extraDetails} onChange={handleInputChange} placeholder="e.g. Bulk order available at 10+ units + pricing" className="creator-input w-full border border-black/20 bg-white/50 p-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-creator-pink font-caveat" />
                  </div>
                </div>

                {/* CUSTOMIZATION */}

                <div className="mt-6 rounded-2xl border border-black/[0.06] bg-black/[0.02] p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input type="checkbox" name="customization" checked={formData.customization} onChange={handleInputChange} className="mt-1 h-4 w-4 cursor-pointer accent-black" />

                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles size={15} />
                        <p className="text-sm font-medium text-black">Customization available</p>
                      </div>

                      <p className="mt-1 text-xs leading-5 text-black/45">Let customers know that they can request personalized changes to this product.</p>
                    </div>
                  </label>
                </div>
              </section>
            </div>

            {/* RIGHT */}

            <div className="space-y-6">
              {/* IMAGES */}

              <section className="rounded-[28px] border border-black/[0.06] bg-white/80 p-5 shadow-[0_8px_40px_rgba(0,0,0,0.035)] backdrop-blur-sm sm:p-7">
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/35">03 · Product images</p>

                  <h2 className="mt-2 font-serif text-2xl text-black">Show it beautifully.</h2>

                  <p className="mt-2 text-xs leading-5 text-black/45">Your cover image is what customers will see first.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {renderImageSlot("productImage1", 0)}

                  {renderImageSlot("productImage2", 1)}

                  {renderImageSlot("productImage3", 2)}

                  {renderImageSlot("productImage4", 3)}
                </div>
              </section>

              {/* PREVIEW INFO */}

              <section className="overflow-hidden rounded-[28px] bg-creator-pink  p-6 text-creator-text shadow-[0_8px_40px_rgba(0,0,0,0.08)] sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white">Quick preview</p>

                <div className="mt-5">
                  <p className="font-serif text-2xl leading-tight">{formData.productName || "Your product"}</p>

                  <p className="mt-2 text-sm leading-5">{formData.productDescription || "Your product description will appear here."}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-sm ">Price</span>

                  <span className="text-lg font-semibold">₹{formData.productPrice || "0"}</span>
                </div>  
                
                
              </section>

              {/* SAVE */}

              <div className="sticky bottom-4 rounded-[24px] border border-black/[0.06] bg-white/90 p-3 shadow-[0_12px_45px_rgba(0,0,0,0.10)] backdrop-blur-xl">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="flex-1  border border-black/10 px-4 py-3 text-sm font-medium text-black/65 transition hover:border-black/20 hover:bg-black/[0.03] active:scale-[0.98] cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex flex-[1.5] items-center justify-center gap-2  bg-black px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-black/85 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
