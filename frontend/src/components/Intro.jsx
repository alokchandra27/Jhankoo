import React, { useLayoutEffect, useRef } from "react";
import paletteImg from "../assets/palette.webp";
import yarnImg from "../assets/yarn.webp";
import sunflowerImg from "../assets/sunflower.webp";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";


import creator1 from "../assets/bookMark.webp";
import creator2 from "../assets/keychains.webp";
import creator3 from "../assets/hanumanji.webp";
import creator4 from "../assets/purse.webp";

const Intro = ({ onIntroComplete }) => {
  // const navigate = useNavigate();
  const introRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
     const tl = gsap.timeline();


      // INITIAL STATES


      gsap.set(".intro-strip", {
        yPercent: -110,
      });

      gsap.set(".intro-kicker", {
        opacity: 0,
        y: 15,
      });

      gsap.set(".intro-logo", {
        opacity: 0,
        y: 25,
        scale: 0.85,
      });

      gsap.set(".intro-tagline", {
        opacity: 0,
        y: 10,
      });

      gsap.set(".intro-photo", {
        opacity: 0,
        y: 50,
        scale: 0.7,
      });

      gsap.set(".intro-doodle", {
        opacity: 0,
        scale: 0,
        rotation: -30,
      });

      gsap.set(".intro-bottom", {
        opacity: 0,
        y: 15,
      });

   
      // 1. COLORFUL TOP STRIPS
    

      tl.to(".intro-strip", {
        yPercent: 0,
        duration: 0.38,
        stagger: 0.08,
        ease: "power3.out",
      });

      
      // 2. SMALL KICKER
   

      tl.to(
        ".intro-kicker",
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
        },
        "-=0.05",
      );

      
      // 3. CREATORLY LOGO


      tl.to(
        ".intro-logo",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: "back.out(1.7)",
        },
        "-=0.05",
      );

      // 4. TAGLINE
     
      tl.to(
        ".intro-tagline",
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
        },
        "-=0.25",
      );

   
      // 5. PHOTOS ONE BY ONE
   
      tl.to(
        ".intro-photo",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.12,
          ease: "back.out(1.5)",
        },
        "-=0.05",
      );


      // 6. DOODLES
    

      tl.to(
        ".intro-doodle",
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "back.out(2)",
        },
        "-=0.2",
      );

  
      // 7. BOTTOM TEXT


      tl.to(
        ".intro-bottom",
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.15",
      );

      // 8. SMALL FLOATING ANIMATION
      

      gsap.to(".floating-butterfly", {
        y: -10,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".floating-star", {
        rotation: 12,
        scale: 1.15,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".floating-flower", {
        y: -7,
        rotation: 8,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 9. HOLD + EXIT


      tl.to({}, { duration: 0.35 });

      tl.to(".intro-content", {
        scale: 1.035,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      });

      // tl.to(
      //   ".intro-page",
      //   {
      //     opacity: 0,
      //     duration: 0.18,
      //     ease: "power2.out",
      //   },
      //   "-=0.15",
      // );


      // 10. GO HOME


      tl.call(() => {
        sessionStorage.setItem("jhankoo-intro-seen", "true");
        if (typeof onIntroComplete === "function") {
          onIntroComplete();
        }
        // navigate("/", { replace: true });
      });
    }, introRef);

    return () => ctx.revert();
  }, [onIntroComplete]);

  return (
    <div ref={introRef} className="intro-page fixed inset-0 z-[99999] overflow-hidden bg-[#fffaf8]">
      {/*          MAIN CONTENT */}

      <div className="intro-content relative flex h-full w-full items-center justify-center">
        {/* ===================================================
            TOP COLOR STRIPS
        ==================================================== */}

        <div className="absolute left-0 top-0 flex h-[70px] w-full overflow-hidden sm:h-[85px]">
          <div className="intro-strip h-full flex-1 bg-creator-accent" />
          <div className="intro-strip h-full flex-1 bg-creator-pink" />
          <div className="intro-strip h-full flex-1 bg-[#ffc96f]" />
          <div className="intro-strip h-full flex-1 bg-[#f65a8d]" />
          <div className="intro-strip h-full flex-1 bg-creator-accent" />
        </div>

        {/* ===================================================
            LEFT BUTTERFLY
        ==================================================== */}

        <div className="floating-butterfly absolute left-[5%] top-[38%] h-10 w-10 sm:left-[3.5%] sm:h-12 sm:w-12">
          <img
            src={paletteImg}
            alt="palette"
            loading="lazy"
            fetchPriority="low"
            decoding="async"
            className="h-full w-full object-contain"
          />
        </div>

        {/* ===================================================
            MAIN CENTER
        ==================================================== */}

        <div className="relative z-10 flex w-full max-w-[760px] flex-col items-center px-5">
          {/* Kicker */}

          <div className="intro-kicker mb-2 mt-8 flex items-center gap-2 text-[6px] font-bold tracking-[3px] text-[#b57a78] sm:text-[7px]">
            <span className="h-px w-5 bg-[#dba4a0] sm:w-6" />
            MADE FOR CREATORS
            <span className="h-px w-5 bg-[#dba4a0] sm:w-6" />
          </div>

          {/* =================================================
              BRAND
          ================================================== */}

          <div className="text-center">
            <div className="intro-logo relative">
              {/* Sparkles */}

              <span className="absolute -left-5 -top-3 text-sm text-[#e8b14e]">✦</span>

              <span className="absolute -bottom-1 -right-6 text-sm text-[#78a989]">✧</span>

              <h1 className="font-caveat text-[50px] font-bold leading-none tracking-[-3px] text-[#e85c76] sm:text-[70px]">
                Jhank<span className="text-[#f19b72]">oo</span>
              </h1>
            </div>

            <p className="intro-tagline mt-3 text-[7px] font-bold uppercase tracking-[3px] text-[#9c7977] sm:text-[8px]">small businesses · big stories</p>
          </div>

          {/* =================================================
              PHOTO GALLERY
          ================================================== */}

          <div className="relative mt-8 h-[125px] w-[310px] sm:mt-10 sm:h-[160px] sm:w-[540px]">
            {/* PHOTO 1 */}

            <div className="intro-photo absolute left-[5px] top-1/2 h-[82px] w-[82px] -translate-y-1/2 rotate-[-7deg] rounded-[10px] bg-white p-1 shadow-[0_15px_35px_rgba(71,46,50,0.13)] sm:left-8 sm:h-[125px] sm:w-[125px] sm:rounded-[12px]">
              <img src={creator1} alt="Creator work" loading="eager" fetchPriority="high" decoding="sync" className="h-full w-full rounded-[7px] object-cover" />

              <span className="absolute -top-1.5 left-1/2 h-2.5 w-8 -translate-x-1/2 -rotate-3 bg-[#ffdda4]/80 sm:h-3 sm:w-10" />
            </div>

            {/* PHOTO 2 */}

            <div className="intro-photo absolute left-[78px] top-1/2 h-[82px] w-[82px] -translate-y-1/2 rotate-[4deg] rounded-[10px] bg-white p-1 shadow-[0_15px_35px_rgba(71,46,50,0.13)] sm:left-[168px] sm:h-[125px] sm:w-[125px] sm:rounded-[12px]">
              <img src={creator2} alt="Creator work" loading="eager" fetchPriority="high" decoding="sync" className="h-full w-full rounded-[7px] object-cover -rotate-360" />

              <span className="absolute -top-1.5 left-1/2 h-2.5 w-8 -translate-x-1/2 -rotate-3 bg-[#ffdda4]/80 sm:h-3 sm:w-10" />
            </div>

            {/* PHOTO 3 */}

            <div className="intro-photo absolute right-[78px] top-1/2 h-[82px] w-[82px] -translate-y-1/2 rotate-[-3deg] rounded-[10px] bg-white p-1 shadow-[0_15px_35px_rgba(71,46,50,0.13)] sm:right-[168px] sm:h-[125px] sm:w-[125px] sm:rounded-[12px]">
              <img src={creator3} alt="Creator work" loading="eager" fetchPriority="high" decoding="sync" className="h-full w-full rounded-[7px] object-cover" />

              <span className="absolute -top-1.5 left-1/2 h-2.5 w-8 -translate-x-1/2 -rotate-3 bg-[#ffdda4]/80 sm:h-3 sm:w-10" />
            </div>

            {/* PHOTO 4 */}

            <div className="intro-photo absolute right-[5px] top-1/2 h-[82px] w-[82px] -translate-y-1/2 rotate-[7deg] rounded-[10px] bg-white p-1 shadow-[0_15px_35px_rgba(71,46,50,0.13)] sm:right-8 sm:h-[125px] sm:w-[125px] sm:rounded-[12px]">
              <img src={creator4} alt="Creator work" loading="eager" fetchPriority="high" decoding="sync" className="h-full w-full rounded-[7px] object-cover" />

              <span className="absolute -top-1.5 left-1/2 h-2.5 w-8 -translate-x-1/2 -rotate-3 bg-[#ffdda4]/80 sm:h-3 sm:w-10" />
            </div>
          </div>

          {/* =================================================
              BOTTOM WORDS
          ================================================== */}

          <div className="intro-bottom mt-1 flex items-center gap-2 text-[5.5px] font-extrabold uppercase tracking-[2px] text-[#9c8583] sm:gap-3 sm:text-[7px]">
            <span>discover</span>

            <span className="h-[3px] w-[3px] rounded-full bg-[#e85c76]" />

            <span>create</span>

            <span className="h-[3px] w-[3px] rounded-full bg-[#e85c76]" />

            <span>connect</span>
          </div>
        </div>

        {/* ===================================================
            DOODLES
        ==================================================== */}

        {/* Star */}

        <div className="intro-doodle floating-star absolute right-[12%] top-[29%] text-xl text-[#efb84e] sm:right-[16%] sm:text-2xl">✦</div>

        {/* Small paint dots */}

        <div className="absolute left-[15%] top-[20%] flex gap-2 sm:left-[19%]">
          <img src={yarnImg} alt="" loading="lazy" fetchPriority="low" decoding="async" className="h-10 w-10 sm:h-15 sm:w-15" />
        </div>

        {/* Flower */}

        <div className="intro-doodle floating-flower absolute bottom-[15%] right-[5%] h-8 w-8 sm:bottom-[17%] sm:right-[6%] sm:h-9 sm:w-9">
          
          <img
            src={sunflowerImg}
            alt="daisy"
            loading="lazy"
            fetchPriority="low"
            decoding="async"
            className="h-full w-full object-contain"
          />
       


        </div>

        {/* Sun */}

        <div className="intro-doodle absolute bottom-[17%] left-[7%] h-8 w-8 rounded-full border-2 border-dashed border-[#efb84e] sm:bottom-[18%] sm:left-[11%] sm:h-9 sm:w-9">
          <div className="absolute inset-2 rounded-full bg-[#ffc85c]" />
        </div>

        {/* Curved line */}

        <div className="intro-doodle absolute bottom-[27%] right-[20%] h-4 w-11 -rotate-12 rounded-[50%] border-t-2 border-[#e89c8e]" />

        {/* Corner text */}

        <div className="absolute bottom-5 right-5 hidden flex-col text-right text-[6px] font-medium leading-relaxed tracking-[2px] text-[#c09a96] sm:flex">
          <span>CRAFTED</span>
          <span>WITH INTENTION</span>
        </div>
      </div>
    </div>
  );
};

export default Intro;
