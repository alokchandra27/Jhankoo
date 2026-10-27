import { ArrowRight, LineSquiggle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

import WhatIsCreatoly from "./Home/WhatIsJhankoo";
import ExploreByCraft from "./Home/ExploreByCraft";
import HowJhankooWorks from "./Home/HowJhankooWorks";
import PeoplePassionPurpose from "./Home/PeoplePassionPurpose";
import FinalCTA from "./Home/FinalCTA";
import Footer from "./Footer";
import JhankooValueSection from "./Home/JhankooValueSection";
import leafStemImg from "../assets/leafStem.webp";
import crochetImg from "../assets/crochet.webp";
import paintsAndAllImg from "../assets/paintsandall.webp";
import keychainsImg from "../assets/keychains.webp";
import yarnImg from "../assets/yarn.webp";
import flowerDaisyImg from "../assets/flowerDaisy.webp";

// HOME

const Home = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // DEMO / SEEDED CREATORS

  const creators = [
    {
      username: "mystriispot",
      name: "MystriiSpot",
      location: "Rishikesh",
      desc: "Handmade with a little magic ✨",
      category: "Handmade art & DIY",
      // image: creator1,
      // avatar: avatar1,
    },
    {
      username: "theclaycorner",
      name: "TheClayCorner",
      location: "Dehradun",
      desc: "Dream it • Shape it • Love it",
      category: "Clay & home decor",
      // image: creator2,
      // avatar: avatar2,
    },
    {
      username: "threadandtales",
      name: "ThreadAndTales",
      location: "Rishikesh",
      desc: "Crochet stories in every loop",
      category: "Crochet & handmade gifts",
      // image: creator3,
      // avatar: avatar3,
    },
    {
      username: "woodenwhimsy",
      name: "WoodenWhimsy",
      location: "Dehradun",
      desc: "Carved with care",
      category: "Wooden decor & gifts",
      // image: creator4,
      // avatar: avatar4,
    },
  ];

  // HELPERS

  const goToExplore = () => {
    navigate("/explore");
  };

  const goToAuth = () => {
    navigate("/auth");
  };

  // const goToCraft = (craftName) => {
  //   navigate(`/explore?craft=${craftName.toLowerCase()}`);
  // };

  // GSAP Timeline Logic

useGSAP(
  () => {
    const tl = gsap.timeline();

    // TEXT
    tl.from(".animate-text", {
      y: 30,
      opacity: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: "power3.out",
    });

    // BUTTONS
    tl.from(
      ".animate-btn",
      {
        y: 15,
        opacity: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: "power2.out",
      },
      "-=0.25"
    );

    // MAIN IMAGE
    tl.from(
      ".animate-img-main",
      {
        scale: 0.94,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.25"
    );

    // SIDE IMAGES
    tl.from(
      ".animate-img-left",
      {
        x: -40,
        opacity: 0,
        duration: 0.55,
        ease: "power3.out",
      },
      "-=0.4"
    );

    tl.from(
      ".animate-img-right",
      {
        x: 40,
        opacity: 0,
        duration: 0.55,
        ease: "power3.out",
      },
      "-=0.4"
    );

    // DECORATIONS
    tl.from(
      ".animate-decor",
      {
        y: 15,
        opacity: 0,
        duration: 0.35,
        stagger: 0.06,
        ease: "power2.out",
      },
      "-=0.25"
    );
  },
  { scope: containerRef }
);

  return (
    <main ref={containerRef} className="w-full overflow-x-hidden bg-creator-bg text-creator-text">
      {/*  HERO */}
      <section className="min-h-0 lg:min-h-screen w-full flex flex-col lg:flex-row">
        {/* LEFT */}
        <div className="w-full lg:w-1/2 min-h-[28rem] sm:min-h-[30rem] md:min-h-[34rem] lg:min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 xl:px-28 py-10 sm:py-12 md:py-14 lg:py-16">
          <div className="w-full lg:-mt-30 md:-mt-0 xl:-mt-30">
            <h1 className="animate-text font-caveat text-6xl sm:text-7xl md:text-8xl font-normal leading-none lg:-rotate-4 md:rotate-0 xl:-rotate-4 text-center lg:text-left md:text-center xl:text-left">
              Small
            </h1>
            <h2 className="animate-text font-caveat text-6xl sm:text-7xl md:text-8xl font-normal leading-none lg:-rotate-4 md:rotate-0 xl:-rotate-4 text-center lg:text-left md:text-center xl:text-left">
              Businesses.
            </h2>
          </div>

          <div className="mt-2">
            <h2 className="animate-text font-caveat text-6xl sm:text-7xl md:text-8xl font-normal leading-none text-creator-pink lg:-rotate-3 md:rotate-0 xl:-rotate-3 text-center lg:text-left md:text-center xl:text-left">
              Big Stories.
            </h2>
          </div>

          <div className="animate-text mt-3 lg:mt-6 xl:mt-8 md:mt-6 flex flex-col items-center text-center lg:text-start lg:items-start md:items-center xl:items-start">
            <p className="font-caveat text-base md:text-xl text-creator-text">Discover unique finds. Support small businesses.</p>
            <LineSquiggle size={50} strokeWidth={1.5} className="text-creator-pink mt-1" />
          </div>

          <div className="flex justify-center lg:justify-start md:justify-center xl:justify-start mt-6 xl:mt-2 md:mt-2 lg:mt-2 gap-5">
            <button
              onClick={goToExplore}
              className="animate-btn group flex items-center cursor-pointer bg-creator-pink px-6 py-3 text-sm font-medium text-white shadow-sm  hover:-translate-y-1 hover:bg-creator-accent hover:shadow-lg"
            >
              Explore Creators
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              onClick={goToAuth}
              className="animate-btn flex items-center cursor-pointer border border-creator-pink/50 bg-white/60 px-6 py-3 text-sm font-medium text-creator-text hover:-translate-y-1 hover:bg-white"
            >
              I'm a Creator
            </button>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full lg:w-1/2 min-h-[32rem] sm:min-h-[36rem] md:min-h-[40rem] lg:min-h-[calc(100vh-80px)] relative flex items-center justify-center px-4 sm:px-10 py-8 sm:py-12 lg:py-0 overflow-hidden lg:overflow-visible -mt-25 lg:-mt-0 md:mt-0">
          {/* Left leaf */}
          <div className="animate-decor absolute top-[16%] sm:top-[9%] md:top-[10%] left-[5%] sm:left-[8%] md:left-[10%] lg:left-[13%] -rotate-90 z-10">
            <img src={leafStemImg} alt="" loading="eager" fetchPriority="high" decoding="sync" className="w-14 sm:w-[4.5rem] md:w-20 lg:w-24" />
          </div>
          {/* Right leaf */}
          <div className="animate-decor absolute top-[22%] sm:top-[8%] md:top-[10%] lg:top-[14%] right-[2%] sm:right-[3%] lg:right-[6%] z-10">
            <img src={leafStemImg} alt="" loading="eager" fetchPriority="high" decoding="sync" className="w-14 sm:w-[4.5rem] md:w-20 lg:w-24" />
          </div>
          {/* Main image */}
          <div className="animate-img-main relative w-[68%] sm:w-[58%] md:w-[50%] lg:w-[65%] aspect-square z-10 rotate-6 border-[10px] sm:border-[14px] border-creator-bg shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-[70vh] h-auto lg:-mt-10">
            {" "}
            <img src={crochetImg} alt="Artwork" loading="eager" fetchPriority="high" decoding="sync" className="w-full h-full object-cover" />
          </div>
          {/* Left image */}
          <div className="animate-img-left absolute top-[24%] sm:top-[27%] md:top-[29%] lg:top-[30%] left-[2%] sm:left-[8%] md:left-[11%] lg:left-[-5%] w-[40%] sm:w-[35%] md:w-[30%] lg:w-[38%] aspect-square z-20 -rotate-12 border-[8px] sm:border-[12px] border-creator-bg shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <img src={paintsAndAllImg} alt="Artwork" loading="eager" fetchPriority="high" decoding="sync" className="w-full h-full object-cover" />
          </div>
          {/* Right image */}
          <div className="animate-img-right absolute bottom-[20%] sm:bottom-[23%] md:bottom-[24%] lg:bottom-[24%] right-[2%] sm:right-[7%] md:right-[10%] lg:right-[3%] w-[38%] sm:w-[33%] md:w-[28%] lg:w-[36%] aspect-square z-30 rotate-12 border-[8px] sm:border-[12px] border-creator-bg shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <img src={keychainsImg} alt="Artwork" loading="eager" fetchPriority="high" decoding="sync" className="w-full h-full object-cover" />
          </div>
          {/* Yarn */}
          <div className="animate-decor absolute bottom-[10%] lg:bottom-[3%] sm:bottom-[6%] md:bottom-[8%] lg:bottom-[14%] right-[2%] sm:right-[6%] lg:right-[18%] z-40">
            <img src={yarnImg} alt="" loading="eager" fetchPriority="high" decoding="sync" className="w-14 sm:w-[4.5rem] md:w-20 lg:w-28" />
          </div>
          {/* Daisy */}
          <div className=" animate-decor absolute bottom-[22%] lg:bottom-[18%] sm:bottom-[12%] md:bottom-[14%] left-[10%] lg:left-[10%] sm:left-[8%] md:left-[10%] z-40">
            <img src={flowerDaisyImg} alt="" loading="eager" fetchPriority="high" decoding="sync" className="w-14 sm:w-[4.5rem] md:w-20 lg:w-28" />
          </div>
        </div>
      </section>

      {/*  WHAT IS CREATORLY*/}

      <WhatIsCreatoly />

      {/*  EXPLORE BY CRAFT */}

      <ExploreByCraft />

      {/* Jhankoo Value Section */}

      <JhankooValueSection />

      {/* HOW CREATORLY WORKS */}

      <HowJhankooWorks />

      {/* PEOPLE / PASSION / PURPOSE */}

      <PeoplePassionPurpose />

      {/*FINAL CTA */}

      <FinalCTA />

      {/*MINI FOOTER */}

      <Footer />
    </main>
  );
};

export default Home;
