import React, { useEffect, useState } from "react";
import { ArrowLeft, Check, ChevronDown, Edit3, Eye, EyeOff, ImagePlus, Loader2, Lock, MessageCircle, Save, Settings, ShieldAlert, Store, Trash2, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../API/API";
import ProcessAndCompressImage from "./ProcessAndCompressImage";

const normalizeProfileLink = (value, baseUrl) => {
  const link = String(value || "").trim();
  return link === baseUrl ? "" : link;
};

export default function StoreSettings() {
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // STORE STATE
  // ---------------------------------------------------------
  const [storeData, setStoreData] = useState({
    storeName: "",
    bio: "",
    countryCode: "91",
    whatsappNumber: "",
    instagramUsername: "",
    instagramLink: "",
    facebookUsername: "",
    facebookLink: "",
    ourStory: "",
    address: "",
    sellerId: "",
    profileImage: { url: "", fileId: "" },
    storeLogo: { url: "", fileId: "" },
    bannerImage: { url: "", fileId: "" },
  });

  const [originalStoreData, setOriginalStoreData] = useState(null);
  const [imageFiles, setImageFiles] = useState({
    profileImage: null,
    storeLogo: null,
    bannerImage: null,
  });
  const [imagePreviews, setImagePreviews] = useState({
    profileImage: "",
    storeLogo: "",
    bannerImage: "",
  });
  const [imageProcessing, setImageProcessing] = useState({
    profileImage: false,
    storeLogo: false,
    bannerImage: false,
  });

  // ---------------------------------------------------------
  // SELLER PROFILE STATE
  // ---------------------------------------------------------
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    currentPassword: "",
    newPassword: "",
  });

  const [originalProfileData, setOriginalProfileData] = useState(null);

  // ---------------------------------------------------------
  // UI STATES
  // ---------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [storeSaving, setStoreSaving] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  const [storeEditing, setStoreEditing] = useState(false);
  const [profileEditing, setProfileEditing] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [storeMessage, setStoreMessage] = useState({
    type: "",
    text: "",
  });

  const [profileMessage, setProfileMessage] = useState({
    type: "",
    text: "",
  });

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ---------------------------------------------------------
  // FETCH STORE + PROFILE
  // ---------------------------------------------------------
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const [storeResponse, profileResponse] = await Promise.all([API.get("/api/store/me"), API.get("/api/auth/profile")]);

      // ---------------- STORE ----------------
      const store = storeResponse?.data?.storeProfile || storeResponse?.data?.store || storeResponse?.data || {};

      const fetchedStoreData = {
        storeName: store.storeName || "",
        bio: store.bio || "",
        whatsappNumber: store.whatsappNumber || "",
        instagramUsername: store.instagramUsername || "",
        instagramLink: normalizeProfileLink(store.instagramLink, "https://instagram.com/"),
        facebookUsername: store.facebookUsername || "",
        facebookLink: normalizeProfileLink(store.facebookLink, "https://facebook.com/"),
        ourStory: store.ourStory || "",
        address: store.address || "",
        sellerId: store.sellerId || "",
        profileImage: store.profileImage || { url: "", fileId: "" },
        storeLogo: store.storeLogo || { url: "", fileId: "" },
        bannerImage: store.bannerImage || { url: "", fileId: "" },
      };

      setStoreData(fetchedStoreData);
      setOriginalStoreData(fetchedStoreData);
      setImagePreviews({
        profileImage: fetchedStoreData.profileImage?.url || "",
        storeLogo: fetchedStoreData.storeLogo?.url || "",
        bannerImage: fetchedStoreData.bannerImage?.url || "",
      });

      // ---------------- PROFILE ----------------
      const profile = profileResponse?.data?.user || profileResponse?.data?.seller || profileResponse?.data || {};

      const fetchedProfileData = {
        firstName: profile.fullName?.firstName || "",
        lastName: profile.fullName?.lastName || "",
        email: profile.email || "",
        username: profile.username || "",
        currentPassword: "",
        newPassword: "",
      };

      setProfileData(fetchedProfileData);
      setOriginalProfileData(fetchedProfileData);
    } catch (error) {
      console.error("Settings fetch error:", error);

      setStoreMessage({
        type: "error",
        text: error?.response?.data?.message || "Unable to load settings. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // STORE INPUT CHANGE
  // ---------------------------------------------------------
  const handleStoreChange = (e) => {
    const { name, value } = e.target;

    setStoreData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const { name, files } = e.target;
    const file = files?.[0];

    if (!file) return;

    try {
      setImageProcessing((prev) => ({ ...prev, [name]: true }));
      const compressedFile = await ProcessAndCompressImage(file);

      setImageFiles((prev) => ({ ...prev, [name]: compressedFile }));
      setImagePreviews((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(compressedFile),
      }));
    } catch (error) {
      console.error(`Image processing failed for ${name}:`, error);
      setStoreMessage({
        type: "error",
        text: "Unable to process the image. Please try another image.",
      });
    } finally {
      setImageProcessing((prev) => ({ ...prev, [name]: false }));
    }
  };

  // ---------------------------------------------------------
  // PROFILE INPUT CHANGE
  // ---------------------------------------------------------
  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------------------------------------------------
  // CANCEL STORE EDIT
  // ---------------------------------------------------------
  const cancelStoreEdit = () => {
    if (originalStoreData) {
      setStoreData(originalStoreData);
    }

    setImageFiles({
      profileImage: null,
      storeLogo: null,
      bannerImage: null,
    });
    setImagePreviews({
      profileImage: originalStoreData?.profileImage?.url || "",
      storeLogo: originalStoreData?.storeLogo?.url || "",
      bannerImage: originalStoreData?.bannerImage?.url || "",
    });

    setStoreEditing(false);

    setStoreMessage({
      type: "",
      text: "",
    });
  };

  // ---------------------------------------------------------
  // CANCEL PROFILE EDIT
  // ---------------------------------------------------------
  const cancelProfileEdit = () => {
    if (originalProfileData) {
      setProfileData(originalProfileData);
    }

    setProfileData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
    }));
    setShowPasswordFields(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);

    setProfileEditing(false);

    setProfileMessage({
      type: "",
      text: "",
    });
  };

  // ---------------------------------------------------------
  // SAVE STORE
  // PUT /api/store/me
  // ---------------------------------------------------------
  const handleStoreSubmit = async (e) => {
    e.preventDefault();

    if (!storeData.storeName.trim()) {
      setStoreMessage({
        type: "error",
        text: "Store name is required.",
      });
      return;
    }

    if (!storeData.bio.trim()) {
      setStoreMessage({
        type: "error",
        text: "Store bio is required.",
      });
      return;
    }

    try {
      setStoreSaving(true);
      setStoreMessage({
        type: "",
        text: "",
      });

      const payload = {
        storeName: storeData.storeName.trim(),
        bio: storeData.bio.trim(),
        whatsappNumber: storeData.whatsappNumber.trim(),
        instagramUsername: storeData.instagramUsername.trim(),
        instagramLink: normalizeProfileLink(storeData.instagramLink, "https://instagram.com/"),
        facebookUsername: storeData.facebookUsername.trim(),
        facebookLink: normalizeProfileLink(storeData.facebookLink, "https://facebook.com/"),
        ourStory: storeData.ourStory.trim(),
        address: storeData.address.trim(),
      };
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
      Object.entries(imageFiles).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      const response = await API.put("/api/store/me", formData);

      const updatedStore = response?.data?.storeProfile || response?.data?.store || response?.data || payload;

      const newStoreData = {
        storeName: updatedStore.storeName || payload.storeName,
        bio: updatedStore.bio || payload.bio,
        countryCode: storeData.countryCode || "91",
        whatsappNumber: updatedStore.whatsappNumber || payload.whatsappNumber,
        instagramUsername: updatedStore.instagramUsername || payload.instagramUsername,
        instagramLink: updatedStore.instagramLink || payload.instagramLink,
        facebookUsername: updatedStore.facebookUsername || payload.facebookUsername,
        facebookLink: updatedStore.facebookLink || payload.facebookLink,
        ourStory: updatedStore.ourStory || payload.ourStory,
        address: updatedStore.address || payload.address,
        sellerId: updatedStore.sellerId || storeData.sellerId,
        profileImage: updatedStore.profileImage || storeData.profileImage,
        storeLogo: updatedStore.storeLogo || storeData.storeLogo,
        bannerImage: updatedStore.bannerImage || storeData.bannerImage,
      };

      setStoreData(newStoreData);
      setOriginalStoreData(newStoreData);
      setImageFiles({
        profileImage: null,
        storeLogo: null,
        bannerImage: null,
      });
      setImagePreviews({
        profileImage: newStoreData.profileImage?.url || imagePreviews.profileImage,
        storeLogo: newStoreData.storeLogo?.url || imagePreviews.storeLogo,
        bannerImage: newStoreData.bannerImage?.url || imagePreviews.bannerImage,
      });

      setStoreEditing(false);

      setStoreMessage({
        type: "success",
        text: "Store settings successfully updated.",
      });
    } catch (error) {
      console.error("Store update error:", error);

      setStoreMessage({
        type: "error",
        text: error?.response?.data?.message || error?.response?.data?.error || "Cannot update store settings.",
      });
    } finally {
      setStoreSaving(false);
    }
  };

  // ---------------------------------------------------------
  // SAVE SELLER PROFILE
  // PUT /api/auth/profile
  // ---------------------------------------------------------
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!profileData.firstName.trim()) {
      setProfileMessage({
        type: "error",
        text: "First name is required.",
      });
      return;
    }

    if (!profileData.lastName.trim()) {
      setProfileMessage({
        type: "error",
        text: "Last name is required.",
      });
      return;
    }

    if (!profileData.email.trim()) {
      setProfileMessage({
        type: "error",
        text: "Email is required.",
      });
      return;
    }

    if (!profileData.username.trim()) {
      setProfileMessage({
        type: "error",
        text: "Username is required.",
      });
      return;
    }

    if (showPasswordFields && (profileData.currentPassword || profileData.newPassword)) {
      if (!profileData.currentPassword || !profileData.newPassword) {
        setProfileMessage({
          type: "error",
          text: "Both the current and new passwords are required to change your password.",
        });
        return;
      }

      if (profileData.newPassword.length < 6) {
        setProfileMessage({
          type: "error",
          text: "The new password must be at least 6 characters long.",
        });
        return;
      }
    }

    try {
      setProfileSaving(true);
      setProfileMessage({
        type: "",
        text: "",
      });

      const payload = {
        fullName: {
          firstName: profileData.firstName.trim(),
          lastName: profileData.lastName.trim(),
        },
        email: profileData.email.trim(),
        username: profileData.username.trim(),
        ...(showPasswordFields && (profileData.currentPassword || profileData.newPassword)
          ? {
              currentPassword: profileData.currentPassword,
              newPassword: profileData.newPassword,
            }
          : {}),
      };

      const response = await API.put("/api/auth/profile", payload);

      const updatedProfile = response?.data?.user || response?.data?.seller || response?.data || payload;

      const newProfileData = {
        firstName: updatedProfile.fullName?.firstName || payload.fullName.firstName,
        lastName: updatedProfile.fullName?.lastName || payload.fullName.lastName,
        email: updatedProfile.email || payload.email,
        username: updatedProfile.username || payload.username,
        currentPassword: "",
        newPassword: "",
      };

      setProfileData(newProfileData);
      setOriginalProfileData(newProfileData);
      setShowPasswordFields(false);
      setShowCurrentPassword(false);
      setShowNewPassword(false);

      setProfileEditing(false);

      setProfileMessage({
        type: "success",
        text: "Profile successfully updated.",
      });
    } catch (error) {
      console.error("Profile update error:", error);

      setProfileMessage({
        type: "error",
        text: error?.response?.data?.message || "Unable to update your profile.",
      });
    } finally {
      setProfileSaving(false);
    }
  };

  // ---------------------------------------------------------
  // DELETE ACCOUNT
  // DELETE /api/auth/profile
  // ---------------------------------------------------------
  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);

      await API.delete("/auth/profile");

      setShowDeleteModal(false);

      // Account deleted → login/auth page
      navigate("/auth", {
        replace: true,
      });
    } catch (error) {
      console.error("Delete account error:", error);

      alert(error?.response?.data?.message || "Unable to delete the account. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ---------------------------------------------------------
  // LOADING SCREEN
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-creator-bg-butter flex items-center justify-center px-5">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-creator-primary text-white shadow-lg">
            <Loader2 size={24} className="animate-spin" />
          </div>

          <p className="mt-4 text-sm font-semibold text-creator-text">Loading your store settings...</p>

          <p className="mt-1 text-xs text-creator-text/45">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-creator-bg font-sans text-creator-text antialiased">
      {/* =====================================================
          TOP HEADER
      ====================================================== */}
      <header className="border-b border-creator-text/5 bg-creator-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-creator-text/10 bg-creator-bg-butter transition hover:bg-white"
              aria-label="Go back"
            >
              <ArrowLeft size={17} />
            </button> */}

            <div>

              
              <div className="flex items-center gap-2">
                <Settings size={17} className="text-creator-primary" />

                <h1 className="font-serif text-xl font-black tracking-tight sm:text-2xl">Store Settings</h1>
              </div>

              <p className="mt-0.5 text-[11px] text-creator-text/50 sm:text-xs">Manage your store, profile & customer contact details.</p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-creator-text/10 bg-creator-bg px-4 py-2 text-xs font-semibold text-creator-text/65 sm:flex">
            <Store size={14} />
            {storeData.storeName || "Your Store"}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* =====================================================
            PAGE INTRO
        ====================================================== */}
        <div className="mb-8">
          <p className="font-serif text-sm font-bold text-creator-primary">Manage your shop</p>

          <h2 className="mt-1 font-caveat text-3xl font-black tracking-tight sm:text-4xl">Make your store feel like yours.</h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-creator-text/55">
            Update the information customers see on your Jhankoo store and choose where they can contact you for orders and enquiries.
          </p>
        </div>

        {/* =====================================================
            STORE SETTINGS
        ====================================================== */}
        <section className="overflow-hidden rounded-3xl border border-creator-text/8 bg-creator-bg shadow-sm">
          {/* Section header */}
          <div className="flex flex-col gap-4 border-b border-creator-text/5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-creator-primary/10 text-creator-primary">
                <Store size={19} />
              </div>

              <div>
                <h3 className="font-caveat text-lg font-black">Store information</h3>

                <p className="mt-0.5 text-xs text-creator-text/45">This information appears on your public store.</p>
              </div>
            </div>

            {!storeEditing ? (
              <button
                type="button"
                onClick={() => {
                  setStoreEditing(true);
                  setStoreMessage({
                    type: "",
                    text: "",
                  });
                }}
                className="inline-flex items-center justify-center gap-2  border border-creator-text/10 bg-creator-bg-butter px-5 py-2.5 text-xs font-bold transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm cursor-pointer"
              >
                <Edit3 size={14} />
                Edit Store
              </button>
            ) : (
              <button
                type="button"
                onClick={cancelStoreEdit}
                className="inline-flex items-center justify-center gap-2 border border-creator-text/10 bg-creator-bg-butter px-5 py-2.5 text-xs font-bold transition hover:bg-white cursor-pointer"
              >
                <X size={14} />
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleStoreSubmit}>
            <div className="space-y-7 px-5 py-6 sm:px-7 sm:py-8">
              {/* Store branding */}
              <div>
                <div className="mb-4">
                  <h4 className="text-sm font-bold">Branding</h4>
                  <p className="mt-1 text-xs text-creator-text/40">Give customers a quick idea about your shop.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {[
                    { name: "profileImage", label: "Profile Image", help: "Shown as your seller profile image." },
                    { name: "storeLogo", label: "Store Logo", help: "Shown as your store brand mark." },
                    { name: "bannerImage", label: "Banner Image", help: "Shown at the top of your public store." },
                  ].map((imageField) => (
                    <div key={imageField.name} className="md:col-span-2">
                      <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-creator-text/55">{imageField.label}</label>

                      <div className="flex flex-col gap-4 rounded-2xl border border-creator-text/8 bg-creator-bg-butter/50 p-4 sm:flex-row sm:items-center">
                        <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-creator-text/8 bg-creator-bg sm:w-40">
                          {imagePreviews[imageField.name] ? (
                            <img src={imagePreviews[imageField.name]} alt={`${imageField.label} preview`} loading="lazy" fetchPriority="low" decoding="async" className="h-full w-full object-cover" />
                          ) : (
                            <ImagePlus size={24} className="text-creator-text/25" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <input
                            disabled={!storeEditing}
                            type="file"
                            name={imageField.name}
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-xs text-creator-text/60 file:mr-3 file:rounded-full file:border-0 file:bg-creator-primary file:px-4 file:py-2 file:text-xs file:font-bold file:text-white"
                          />
                          <p className="mt-2 text-[10px] text-creator-text/40">
                            {imageProcessing[imageField.name] ? "Processing image..." : `${imageField.help} JPG, PNG or WebP recommended.`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Store name */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-creator-text/55">Store Name</label>

                    <input
                      required
                      disabled={!storeEditing}
                      type="text"
                      name="storeName"
                      value={storeData.storeName}
                      onChange={handleStoreChange}
                      placeholder="E.g. Balbeer Crafts"
                      className={`w-full rounded-2xl border p-3.5 text-sm font-semibold outline-none transition ${
                        storeEditing
                          ? "border-creator-text/10 bg-creator-bg-butter focus:border-creator-accent focus:ring-4 focus:ring-creator-accent/5"
                          : "border-transparent bg-creator-bg-butter/60 text-creator-text/80"
                      }`}
                    />
                  </div>

                  {/* Seller ID */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-creator-text/55">Seller ID</label>

                    <input
                      readOnly
                      type="text"
                      value={storeData.sellerId}
                      className="w-full rounded-2xl border border-transparent bg-creator-bg-butter/60 p-3.5 text-sm font-semibold text-creator-text/60 outline-none"
                    />
                  </div>

                  {/* Bio */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-creator-text/55">Store Bio</label>

                    <textarea
                      required
                      disabled={!storeEditing}
                      rows={4}
                      name="bio"
                      value={storeData.bio}
                      onChange={handleStoreChange}
                      placeholder="Tell customers what you make..."
                      className={`w-full resize-none rounded-2xl border p-3.5 text-sm leading-6 outline-none transition ${
                        storeEditing
                          ? "border-creator-text/10 bg-creator-bg-butter focus:border-creator-accent focus:ring-4 focus:ring-creator-accent/5"
                          : "border-transparent bg-creator-bg-butter/60 text-creator-text/80"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="border-t border-creator-text/5 pt-7">
                <div className="mb-4">
                  <h4 className="flex items-center gap-2 text-sm font-bold">
                    <MessageCircle size={16} className="text-green-600" />
                    Customer contact
                  </h4>

                  <p className="mt-1 text-xs text-creator-text/40">These channels are used when customers want to contact you.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* WhatsApp */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-creator-text/55">WhatsApp Number</label>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <div className="relative sm:w-56">
                        <select
                          disabled={!storeEditing}
                          name="countryCode"
                          value={storeData.countryCode}
                          onChange={handleStoreChange}
                          className={`w-full appearance-none rounded-2xl border p-3.5 pr-10 text-sm font-bold outline-none transition ${
                            storeEditing ? "border-creator-text/10 bg-creator-bg-butter focus:border-creator-accent" : "border-transparent bg-creator-bg-butter/60"
                          }`}
                        >
                          <option value="91">🇮🇳 +91 India</option>
                          <option value="1">🇺🇸 +1 USA</option>
                          <option value="44">🇬🇧 +44 UK</option>
                          <option value="971">🇦🇪 +971 UAE</option>
                        </select>

                        <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-creator-text/40" />
                      </div>

                      <input
                        disabled={!storeEditing}
                        type="tel"
                        name="whatsappNumber"
                        value={storeData.whatsappNumber}
                        onChange={handleStoreChange}
                        placeholder="9876543210"
                        className={`flex-1 rounded-2xl border p-3.5 text-sm font-semibold tracking-wide outline-none transition ${
                          storeEditing
                            ? "border-creator-text/10 bg-creator-bg-butter focus:border-creator-accent focus:ring-4 focus:ring-creator-accent/5"
                            : "border-transparent bg-creator-bg-butter/60"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Instagram username */}
                  <div>
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-creator-text/55">Instagram Username</label>

                    <div className="relative">
                      {/* <Instagram size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-creator-text/35" /> */}

                      <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm font-bold text-creator-text/35">@</span>

                      <input
                        disabled={!storeEditing}
                        type="text"
                        name="instagramUsername"
                        value={storeData.instagramUsername}
                        onChange={handleStoreChange}
                        placeholder="username"
                        className={`w-full rounded-2xl border py-3.5 pl-16 pr-3.5 text-sm font-semibold outline-none transition ${
                          storeEditing
                            ? "border-creator-text/10 bg-creator-bg-butter focus:border-creator-accent focus:ring-4 focus:ring-creator-accent/5"
                            : "border-transparent bg-creator-bg-butter/60"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Instagram URL */}
                  <div>
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-creator-text/55">Instagram Profile URL</label>

                    <input
                      disabled={!storeEditing}
                      type="url"
                      name="instagramLink"
                      value={storeData.instagramLink}
                      onChange={handleStoreChange}
                      placeholder="https://instagram.com/username"
                      className={`w-full rounded-2xl border p-3.5 text-sm outline-none transition ${
                        storeEditing ? "border-creator-text/10 bg-creator-bg-butter focus:border-creator-accent focus:ring-4 focus:ring-creator-accent/5" : "border-transparent bg-creator-bg-butter/60"
                      }`}
                    />
                  </div>

                  {/* Facebook username */}
                  <div>
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-creator-text/55">Facebook Username</label>

                    <input
                      disabled={!storeEditing}
                      type="text"
                      name="facebookUsername"
                      value={storeData.facebookUsername}
                      onChange={handleStoreChange}
                      placeholder="username"
                      className={`w-full rounded-2xl border p-3.5 text-sm font-semibold outline-none transition ${
                        storeEditing ? "border-creator-text/10 bg-creator-bg-butter focus:border-creator-accent focus:ring-4 focus:ring-creator-accent/5" : "border-transparent bg-creator-bg-butter/60"
                      }`}
                    />
                  </div>

                  {/* Facebook URL */}
                  <div>
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-creator-text/55">Facebook Profile URL</label>

                    <input
                      disabled={!storeEditing}
                      type="url"
                      name="facebookLink"
                      value={storeData.facebookLink}
                      onChange={handleStoreChange}
                      placeholder="https://facebook.com/username"
                      className={`w-full rounded-2xl border p-3.5 text-sm outline-none transition ${
                        storeEditing ? "border-creator-text/10 bg-creator-bg-butter focus:border-creator-accent focus:ring-4 focus:ring-creator-accent/5" : "border-transparent bg-creator-bg-butter/60"
                      }`}
                    />
                  </div>

                  {/* Our Story */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-creator-text/55">Our Story</label>

                    <textarea
                      disabled={!storeEditing}
                      rows={3}
                      name="ourStory"
                      value={storeData.ourStory}
                      onChange={handleStoreChange}
                      placeholder="We are handmade creators who make thoughtful pieces with care and love."
                      className={`w-full resize-none rounded-2xl border p-3.5 text-sm leading-6 outline-none transition ${
                        storeEditing ? "border-creator-text/10 bg-creator-bg-butter focus:border-creator-accent focus:ring-4 focus:ring-creator-accent/5" : "border-transparent bg-creator-bg-butter/60"
                      }`}
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-creator-text/55">Address</label>

                    <textarea
                      disabled={!storeEditing}
                      rows={3}
                      name="address"
                      value={storeData.address}
                      onChange={handleStoreChange}
                      placeholder="Your business address"
                      className={`w-full resize-none rounded-2xl border p-3.5 text-sm leading-6 outline-none transition ${
                        storeEditing ? "border-creator-text/10 bg-creator-bg-butter focus:border-creator-accent focus:ring-4 focus:ring-creator-accent/5" : "border-transparent bg-creator-bg-butter/60"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Store message */}
              {storeMessage.text && (
                <div
                  className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-semibold ${
                    storeMessage.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {storeMessage.type === "success" ? <Check size={15} /> : <ShieldAlert size={15} />}

                  {storeMessage.text}
                </div>
              )}

              {/* Save button */}
              {storeEditing && (
                <div className="flex justify-end border-t border-creator-text/5 pt-6">
                  <button
                    disabled={storeSaving || Object.values(imageProcessing).some(Boolean)}
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-creator-primary px-7 py-3 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {storeSaving ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={15} />
                        Save Store Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>
        </section>

        {/* =====================================================
            SELLER PROFILE
        ====================================================== */}
        <section className="mt-7 overflow-hidden rounded-3xl border border-creator-text/8 bg-creator-bg shadow-sm">
          <div className="flex flex-col gap-4 border-b border-creator-text/5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-creator-accent/10 text-creator-accent">
                <User size={19} />
              </div>

              <div>
                <h3 className="font-caveat text-lg font-black">Seller profile</h3>

                <p className="mt-0.5 text-xs text-creator-text/45">Your personal account information.</p>
              </div>
            </div>

            {!profileEditing ? (
              <button
                type="button"
                onClick={() => {
                  setProfileEditing(true);
                  setProfileMessage({
                    type: "",
                    text: "",
                  });
                }}
                className="inline-flex items-center justify-center gap-2  border border-creator-text/10 bg-creator-bg-butter px-5 py-2.5 text-xs font-bold transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm cursor-pointer"
              >
                <Edit3 size={14} />
                Edit Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={cancelProfileEdit}
                className="inline-flex items-center justify-center gap-2  border border-creator-text/10 bg-creator-bg-butter px-5 py-2.5 text-xs font-bold transition hover:bg-white cursor-pointer"
              >
                <X size={14} />
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div className="space-y-6 px-5 py-6 sm:px-7 sm:py-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* First name */}
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-creator-text/55">First Name</label>

                  <input
                    required
                    disabled={!profileEditing}
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    className={`w-full rounded-2xl border p-3.5 text-sm font-semibold outline-none transition ${
                      profileEditing ? "border-creator-text/10 bg-creator-bg-butter focus:border-creator-accent focus:ring-4 focus:ring-creator-accent/5" : "border-transparent bg-creator-bg-butter/60"
                    }`}
                  />
                </div>

                {/* Last name */}
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-creator-text/55">Last Name</label>

                  <input
                    required
                    disabled={!profileEditing}
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    className={`w-full rounded-2xl border p-3.5 text-sm font-semibold outline-none transition ${
                      profileEditing ? "border-creator-text/10 bg-creator-bg-butter focus:border-creator-accent focus:ring-4 focus:ring-creator-accent/5" : "border-transparent bg-creator-bg-butter/60"
                    }`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-creator-text/55">Email</label>

                  <input
                    required
                    disabled={!profileEditing}
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className={`w-full rounded-2xl border p-3.5 text-sm font-semibold outline-none transition ${
                      profileEditing ? "border-creator-text/10 bg-creator-bg-butter focus:border-creator-accent focus:ring-4 focus:ring-creator-accent/5" : "border-transparent bg-creator-bg-butter/60"
                    }`}
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-creator-text/55">Username</label>

                  <input
                    required
                    disabled={!profileEditing}
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    className={`w-full rounded-2xl border p-3.5 text-sm font-semibold outline-none transition ${
                      profileEditing ? "border-creator-text/10 bg-creator-bg-butter focus:border-creator-accent focus:ring-4 focus:ring-creator-accent/5" : "border-transparent bg-creator-bg-butter/60"
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="border-t border-creator-text/5 pt-6">
                <div className="flex flex-col gap-4 rounded-2xl border border-creator-text/5 bg-creator-bg-butter/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-3">
                    <Lock size={16} className="mt-0.5 shrink-0 text-creator-text/40" />

                    <div>
                      <p className="text-xs font-bold">Change password</p>

                      <p className="mt-1 text-[11px] leading-5 text-creator-text/45">Verify your current password before setting a new one.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!profileEditing}
                    onClick={() => {
                      setShowPasswordFields((prev) => !prev);
                      setProfileMessage({ type: "", text: "" });
                    }}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-creator-text/10 bg-creator-bg px-4 py-2 text-xs font-bold transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showPasswordFields ? "Hide password fields" : "Change password"}
                  </button>
                </div>

                {showPasswordFields && (
                  <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-creator-text/55">Current Password</label>

                      <div className="relative">
                        <input
                          disabled={!profileEditing}
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={profileData.currentPassword}
                          onChange={handleProfileChange}
                          autoComplete="current-password"
                          placeholder="Enter your current password"
                          className={`w-full rounded-2xl border p-3.5 pr-12 text-sm font-semibold outline-none transition ${
                            profileEditing ? "border-creator-text/10 bg-creator-bg-butter focus:border-creator-accent focus:ring-4 focus:ring-creator-accent/5" : "border-transparent bg-creator-bg-butter/60"
                          }`}
                        />

                        <button
                          type="button"
                          disabled={!profileEditing}
                          onClick={() => setShowCurrentPassword((prev) => !prev)}
                          aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-creator-text/45 transition hover:bg-creator-text/5 hover:text-creator-text disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {showCurrentPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-creator-text/55">New Password</label>

                      <div className="relative">
                        <input
                          disabled={!profileEditing}
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={profileData.newPassword}
                          onChange={handleProfileChange}
                          autoComplete="new-password"
                          placeholder="Enter your new password"
                          className={`w-full rounded-2xl border p-3.5 pr-12 text-sm font-semibold outline-none transition ${
                            profileEditing ? "border-creator-text/10 bg-creator-bg-butter focus:border-creator-accent focus:ring-4 focus:ring-creator-accent/5" : "border-transparent bg-creator-bg-butter/60"
                          }`}
                        />

                        <button
                          type="button"
                          disabled={!profileEditing}
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-creator-text/45 transition hover:bg-creator-text/5 hover:text-creator-text disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {showNewPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile message */}
              {profileMessage.text && (
                <div
                  className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-semibold ${
                    profileMessage.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {profileMessage.type === "success" ? <Check size={15} /> : <ShieldAlert size={15} />}

                  {profileMessage.text}
                </div>
              )}

              {/* Save profile */}
              {profileEditing && (
                <div className="flex justify-end border-t border-creator-text/5 pt-6">
                  <button
                    disabled={profileSaving}
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-creator-primary px-7 py-3 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {profileSaving ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={15} />
                        Save Profile
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>
        </section>

        {/* =====================================================
            DANGER ZONE
        ====================================================== */}
        <section className="mt-7 overflow-hidden rounded-3xl border border-red-200 bg-red-50/40">
          <div className="flex items-start gap-4 border-b border-red-200 px-5 py-5 sm:px-7">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <Trash2 size={19} />
            </div>

            <div>
              <h3 className="font-caveat text-lg font-black text-red-800">Danger Zone</h3>

              <p className="mt-1 text-xs leading-5 text-red-700/65">These actions are permanent. Please make sure before continuing.</p>
            </div>
          </div>

          <div className="flex flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <h4 className="text-sm font-bold text-red-900">Delete your Jhankoo account</h4>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-red-800/60">Your seller account and associated store access will be permanently deleted. This action cannot be undone.</p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2  border border-red-300 bg-white px-5 py-2.5 text-xs font-black text-red-600 transition hover:bg-red-600 hover:text-white cursor-pointer"
            >
              <Trash2 size={14} />
              Delete Account
            </button>
          </div>
        </section>
      </main>

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ====================================================== */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-creator-bg shadow-2xl">
            <div className="p-6 sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <Trash2 size={21} />
              </div>

              <h3 className="mt-5 font-serif text-2xl font-black">Delete your account?</h3>

              <p className="mt-3 text-sm leading-6 text-creator-text/55">This will permanently remove your Jhankoo seller account. Please make sure you really want to continue.</p>

              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
                <div className="flex gap-3">
                  <ShieldAlert size={17} className="mt-0.5 shrink-0 text-red-600" />

                  <p className="text-xs font-semibold leading-5 text-red-700">This action cannot be undone.</p>
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-full border border-creator-text/10 px-5 py-3 text-xs font-bold transition hover:bg-creator-bg-butter disabled:opacity-50"
                >
                  Keep My Account
                </button>

                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={handleDeleteAccount}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-xs font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Yes, Delete Account
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
