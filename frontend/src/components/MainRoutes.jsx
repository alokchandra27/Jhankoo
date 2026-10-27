import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import NotFound from "./NotFound";

// Pages aur Components  Lazy Imports
const Home = lazy(() => import("../pages/Home"));
const Explore = lazy(() => import("../pages/Explore"));
const ProductDetails = lazy(() => import("../pages/ProductDetails"));
const Cart = lazy(() => import("../pages/Cart"));
const PublicStore = lazy(() => import("../pages/PublicStore"));
const VibeLoader = lazy(() => import("./VibeLoader"));
const Intro = lazy(() => import("./Intro"));
const Auth = lazy(() => import("../pages/Auth"));

// Seller Sections
const ProductsManagement = lazy(() => import("./Seller/ProductManagement"));

const StoreSettings = lazy(() => import("./Seller/StoreSettings"));

const EditProduct = lazy(() => import("./Seller/EditProduct"));

const Wishlist = lazy(() => import("../pages/Wishlist"));
const OurStory = lazy(() => import("../pages/OurStory"));


// CREATORLY PAGE LOADER


const JhankooPageLoader = () => {
  return (
    <div className="flex min-h-[100vh] items-center justify-center bg-creator-bg-butter px-6">
      <div className="text-center">
        {/* Brand */}
        <div className="flex items-center justify-center">
          <span className="font-caveat text-4xl text-neutral-800">Jhankoo</span>

          <span className="ml-1 animate-pulse text-lg text-creator-pink">♥</span>
        </div>

        {/* Animated dots */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-creator-pink" style={{ animationDelay: "0ms" }} />

          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-creator-pink/70" style={{ animationDelay: "150ms" }} />

          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-creator-pink/40" style={{ animationDelay: "300ms" }} />
        </div>

        <p className="mt-3 text-xs tracking-wide text-neutral-400">Your Personal Storefront...</p>
      </div>
    </div>
  );
};


// LEGACY PUBLIC STORE REDIRECT


const LegacyPublicStoreRedirect = () => {
  const { storeName } = useParams();

  return <Navigate to={`/publicstore/${encodeURIComponent(storeName)}`} replace />;
};


// MAIN ROUTES


const MainRoutes = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <Suspense fallback={<JhankooPageLoader />}>
      <Routes>
   
        {/* 1. UNIVERSAL CUSTOMER / VISITOR PATHS */}


        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />

        <Route path="/explore" element={<Explore />} />

        <Route path="/productDetails/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />

        {/* <Route path="/loader" element={<VibeLoader />} /> */}

        {/* <Route path="/intro" element={<Intro />} /> */}

        <Route path="/auth" element={<Auth setIsLoggedIn={setIsLoggedIn} />} />

        <Route path="/our-story" element={<OurStory />} />

       
        {/* 2. PERSONAL ISOLATED SELLER STOREFRONT */}
      

        <Route path="/publistore/:storeName" element={<LegacyPublicStoreRedirect />} />

        <Route path="/publicstore" element={<Navigate to="/" replace />} />

        <Route path="/publicstore/:storeName" element={<PublicStore />} />

        <Route path="/publicstore/:storeName/product/:id" element={<ProductDetails />} />


        {/* 3. SELLER CONTROL PATHS */}


        <Route path="/products" element={<ProductsManagement />} />

        <Route path="/store/settings" element={<StoreSettings />} />

        <Route path="/products/edit/:productId" element={<EditProduct />} />

        <Route path="/publicstore/:storeName/cart" element={<Cart />} />

        <Route path="/publicstore/:storeName/wishlist" element={<Wishlist />} />

        {/* 4. CATCH-ALL ROUTE FOR 404 PAGE */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default MainRoutes;
