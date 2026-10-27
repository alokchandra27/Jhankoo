import React, { useState } from "react";
import MainRoutes from "./components/MainRoutes";
import Navbar from "./components/Navbar";
import CreatorNavbar from "./components/CreatorNavbar";
import VibeLoader from "./components/VibeLoader";
import Intro from "./components/Intro";
import ScrollToTop from "./components/ScrollToTop";
import { useLocation } from "react-router-dom";
import "./index.css";
import Footer from "./pages/Footer";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    Boolean(localStorage.getItem("token"))
  );

  const location = useLocation();

  // 1. Session Storage is best: Tab close hone par forget karega, refresh par yaad rakhega.
  const [hasSeenIntro, setHasSeenIntro] = useState(
    () => sessionStorage.getItem("jhankoo-intro-seen") === "true"
  );

  // 2. Main Logic: First visit par current URL chahe jo bhi ho, loader aur intro
  // dono dikhenge. Session me complete hone ke baad direct page render hoga.
  const [appStage, setAppStage] = useState(() => {
    const hasSeen = sessionStorage.getItem("jhankoo-intro-seen") === "true";
    
    if (hasSeen) {
      return "home";
    }
    return "loader";
  });

  const isCreatorStoreRoute = location.pathname.startsWith("/publicstore");

  const handleLoaderComplete = () => setAppStage("intro");
  
  const handleIntroComplete = () => {
    sessionStorage.setItem("jhankoo-intro-seen", "true");
    setHasSeenIntro(true);
    setAppStage("home");
  };

  return (
    <div className="min-h-screen bg-creator-bg">

      {/* NAVBAR LAYER */}
      {appStage === "home" && location.pathname !== "/intro" && (
        isCreatorStoreRoute ? (
          <CreatorNavbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        )
      )}

      {/* STAGE 1: LOADER (Fresh session par kisi bhi URL ke liye) */}
      {appStage === "loader" && (
        <VibeLoader onComplete={handleLoaderComplete} />
      )}

      {/* STAGE 2: INTRO */}
      {appStage === "intro" && (
        <Intro onIntroComplete={handleIntroComplete} />
      )}

      {/* STAGE 3: ACTUAL WEBSITE SYSTEM */}
      {appStage === "home" && (
        <>
          <ScrollToTop /> 
          <MainRoutes
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            hasSeenIntro={hasSeenIntro}
            setHasSeenIntro={setHasSeenIntro}
          />
        </>
      )}

      {/* <Footer/> */}

    </div>
  );
};

export default App;
