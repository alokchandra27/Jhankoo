import { Heart, Sparkles, Share2, ShoppingBag } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import supportSmallBusinessImg from "../../assets/supportsmallbusiness.webp";
import paletteImg from "../../assets/palette.webp";


gsap.registerPlugin(ScrollTrigger);

const WhatIsJhankoo = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      // RIGHT CONTENT
      tl.from(
        ".what-content",
        {
          x: 50,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.45"
      );

      // FEATURE CARDS
      tl.from(
        ".what-feature",
        {
          y: 30,
          opacity: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: "power2.out",
        },
        "-=0.35"
      );

      // LEFT IMAGE
      gsap.from(".what-image", {
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
        x: -60,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });

    },
    {
      scope: sectionRef,
    }
  );

  return (
    <section ref={sectionRef} className=" relative w-full bg-[#FAF7F2] px-6 py-20 sm:px-10 md:py-24 lg:px-20">
      <div className="mx-auto flex max-w-7xl lg:flex-col flex-col-reverse items-center gap-12 lg:flex-row lg:gap-20  lg:mt-0 -mt-10">


        {/* LEFT IMAGE */}

        <div ref={imageRef} className="what-image relative w-full lg:w-[48%]">
          <div  className="relative mx-auto max-w-xl overflow-hidden rounded-[3rem] bg-[#F8E8E7] p-5 sm:p-8">
            <div className="relative overflow-hidden rounded-[2rem]">
              <img src={supportSmallBusinessImg} alt="Creator storefront" loading="lazy" decoding="async" className="h-auto w-full object-cover transition-transform duration-700 hover:scale-105 scale-150" />
            </div>

            <div className="absolute -right-2 top-8 rotate-12 text-creator-pink">
              <Heart size={34} fill="currentColor" />
            </div>

            <div className="absolute bottom-6 left-4 rotate-[-12deg] hover:rotate-2 trasition-transform duration-700">
              <img src={paletteImg} alt="" loading="lazy" fetchPriority="low" decoding="async" className="w-16 sm:w-20" />
            </div>
          </div>
        </div>

        {/* RIGHT TEXT */}

        <div className="what-content w-full lg:w-[52%]">
          <p className="mb-2 font-caveat text-lg text-creator-pink sm:text-xl">More than a product link.</p>

          <h2 className="font-playfair text-3xl font-bold leading-tight text-creator-text sm:text-4xl md:text-5xl">
            A digital storefront made
            <br />
            for small businesses.
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
            Jhankoo gives independent brands, local shops, and home entrepreneurs a simple platform to showcase their products, tell their unique brand story, and accept direct orders from
            customers.
          </p>

          <div className=" mt-9 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="what-feature group">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-creator-pink transition-transform duration-300 group-hover:scale-110">
                <Sparkles size={21} />
              </div>

              <h3 className="font-semibold text-neutral-800">Showcase your products</h3>

              <p className="mt-2 text-xs leading-5 text-neutral-500">Build and launch your own simple mini online store in just a few minutes.</p>
            </div>

            <div className="what-feature group border-neutral-200 sm:border-l sm:pl-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 transition-transform duration-300 group-hover:scale-110">
                <Share2 size={21} />
              </div>

              <h3 className="font-semibold text-neutral-800">Share anywhere</h3>

              <p className="mt-2 text-xs leading-5 text-neutral-500">Share your Easily drop your Jhankoo store link in your Instagram bio, WhatsApp chats, or any social media platform.</p>
            </div>

            <div className="what-feature group border-neutral-200 sm:border-l sm:pl-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-700 transition-transform duration-300 group-hover:scale-110">
                <ShoppingBag size={21} />
              </div>

              <h3 className="font-semibold text-neutral-800">Sell directly</h3>

              <p className="mt-2 text-xs leading-5 text-neutral-500"> Let new customers discover your brand, receive orders directly, and grow your business without any hassle.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsJhankoo;
