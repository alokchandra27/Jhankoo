import React, { useRef } from "react";
import { Heart, Mail, ArrowUpRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const navigate = useNavigate();
  const footerRef = useRef(null);

  const goToExplore = () => {
    navigate("/explore");
  };

  const goToAuth = () => {
    navigate("/auth");
  };

  const sendFeedback = () => {
    window.location.href = "mailto:alokchandra2621@gmail.com?subject=Feedback%20for%20Jhankoo&body=Hi%20Alok,%0A%0AI%20wanted%20to%20share%20some%20feedback%20about%20Jhankoo:%0A%0A";
  };

  useGSAP(() => {
    // 1. Left Side Contents (Brand Text + Developer Card)
    gsap.from(".animate-footer-left", {
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%", // Trigger late since footers are at the extreme bottom
        toggleActions: "play none none none",
      },
      y: 25,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: "power3.out"
    });

    // 2. Right Side Content Columns (Links Group)
    gsap.from(".animate-footer-right", {
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      y: 25,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    });

    // 3. Middle Strip & Bottom Elements
    gsap.from(".animate-footer-bottom", {
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      y: 15,
      opacity: 0,
      duration: 0.55,
      stagger: 0.1,
      ease: "power2.out"
    });

  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="border-t border-neutral-200/70 bg-creator-bg-butter px-5 pb-7 pt-10 sm:px-8 md:px-12">
      <div className="mx-auto max-w-7xl">
        {/* TOP FOOTER */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          {/* BRAND / DEVELOPER */}
          <div className="max-w-md">
            <div className="animate-footer-left mb-3 flex items-center gap-2">
              <span className="font-caveat text-3xl text-neutral-900">Jhankoo</span>
              <Heart size={17} className="text-creator-pink" fill="currentColor" />
            </div>

            <p className="animate-footer-left text-sm leading-6 text-neutral-500">
              A little space for small businesses to show what they make, tell their story, and connect directly with their customers.
            </p>

            {/* DEVELOPER CARD */}
            <button
              onClick={sendFeedback}
              className="animate-footer-left group mt-5 flex w-fit items-center gap-3 rounded-2xl border border-neutral-200 bg-white/70 px-4 py-3 text-left transition-colors duration-300 hover:border-creator-pink/30 hover:bg-white hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-creator-pink/10 text-creator-pink">
                <Mail size={18} />
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Developed by</p>
                <p className="flex items-center gap-1 font-medium text-neutral-800">
                  Alok Chandra
                  <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </p>
              </div>
            </button>
          </div>

          {/* LINKS + CTA */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-12">
            {/* LINKS */}
            <div className="animate-footer-right">
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">Explore</p>

              <div className="flex flex-col gap-2.5 text-sm text-neutral-500">
                <button onClick={() => navigate("/")} className="w-fit transition-colors hover:text-creator-pink">
                  Home
                </button>

                <button onClick={goToExplore} className="w-fit transition-colors hover:text-creator-pink">
                  Explore
                </button>

                <button onClick={() => navigate("/our-story")} className="w-fit transition-colors hover:text-creator-pink">
                  Our Story
                </button>

                <button
                  onClick={() => {
                    navigate("/");
                    setTimeout(() => {
                      document.getElementById("jhankoo-how-it-works")?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }, 100);
                  }}
                  className="w-fit transition-colors hover:text-creator-pink"
                >
                  How it Works
                </button>
              </div>
            </div>

            {/* CREATOR CTA */}
            <div className="animate-footer-right max-w-[220px]">
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">Building something?</p>

              <button onClick={goToAuth} className="group flex items-center gap-2 text-sm font-medium text-neutral-800 transition-colors hover:text-creator-pink">
                Create your store
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* FEEDBACK STRIP */}
        <div className="animate-footer-bottom mt-10 flex flex-col gap-4 rounded-2xl border border-neutral-200/80 bg-white/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Sparkles size={17} className="mt-0.5 shrink-0 text-creator-pink" />

            <div>
              <p className="text-sm font-medium text-neutral-800">Have an idea, found a bug, or just want to say hi?</p>
              <p className="mt-0.5 text-xs text-neutral-500">I'd genuinely love to hear what you think about Jhankoo.</p>
            </div>
          </div>

          <button
            onClick={sendFeedback}
            className="flex w-fit items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-700 transition-colors duration-300 hover:border-creator-pink hover:text-creator-pink"
          >
            <Mail size={14} />
            Send feedback
          </button>
        </div>

        {/* BOTTOM */}
        <div className="animate-footer-bottom mt-7 flex flex-col gap-2 border-t border-neutral-200/70 pt-5 text-[11px] text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Jhankoo. Made with <Heart size={11} className="mx-0.5 inline text-creator-pink" fill="currentColor" /> for people who make things.
          </p>

          <p className="font-caveat text-base text-neutral-500">Developed by Alok Chandra</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
