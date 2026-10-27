import { ArrowRight, Check, Link2, ShoppingBag, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bg1Img from "../../assets/bg1.webp";
import bg2Img from "../../assets/bg2.webp";
import bg3Img from "../../assets/bg3.webp";

gsap.registerPlugin(ScrollTrigger);


const JhankooValueSection = () => {
  const navigate = useNavigate();

  const JhankooValueSectionRef = useRef(null);
  const OneLinkWholeStoreRef = useRef(null);
  const WhyJhankooRef = useRef(null);
  const CTARef = useRef(null);

  const features = [
    {
      icon: ShoppingBag,
      bgImage:bg1Img,
      title: "Your products",
      text: "Showcase everything you sell in one beautiful, organized space.",
    },
    {
      icon: UserRound,
      bgImage:bg2Img,
      title: "Your story",
      text: "Tell customers who you are, what you stand for, and what makes your business special.",
    },
    {
      icon: Link2,
      bgImage:bg3Img,
      title: "Your way to order",
      text: "Let customers place orders directly or connect with you seamlessly via WhatsApp or Instagram.",
    },
  ];

  const benefits = [
    "No website building required",
    "No customer login friction ",
    "No complicated setup",
    "Share your link anywhere",
  ];

  useGSAP(() => {
    // 1. UPPER HERO TEXT ANIMATION (Pure Section ke aate hi)
    gsap.from(".animate-text-top", {
      scrollTrigger: {
        trigger: JhankooValueSectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      y: 30,
      opacity: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: "power3.out",
    });

    // 2. CTA BUTTONS ANIMATION (Jab actual CTA div screen par aaye)
    gsap.from(".animate-button", {
      scrollTrigger: {
        trigger: CTARef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
    });

    // 3. MIDDLE STORE LINK TEXT ANIMATION
    gsap.from(".animate-text-middle", {
      scrollTrigger: {
        trigger: OneLinkWholeStoreRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      y: 30,
      opacity: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: "power3.out",
    });

    // 4. FEATURES GRID CARDS ANIMATION
    gsap.from(".animate-grid-card", {
      scrollTrigger: {
        trigger: OneLinkWholeStoreRef.current,
        start: "top 65%",
        toggleActions: "play none none none",
      },
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });

    // 5. BOTTOM WHY CREATORLY TEXT ANIMATION
    gsap.from(".animate-text-bottom", {
      scrollTrigger: {
        trigger: WhyJhankooRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      y: 30,
      opacity: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: "power3.out",
    });

  }, { scope: JhankooValueSectionRef });

  return (
    <section ref={JhankooValueSectionRef} className="relative overflow-hidden bg-[#f8f3e8] px-5 py-20 sm:px-8 lg:px-16 lg:py-28">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-yellow-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">

        {/*  upper page content  */}
        <div className="mx-auto max-w-3xl text-center">

          <p className="animate-text-top mb-5 text-sm font-medium uppercase tracking-[0.25em] text-neutral-500">
            Built for small businesses
          </p>

          <h2 className="animate-text-top text-4xl font-semibold leading-[1.08] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Your brand deserves
            <span className="animate-text-top block font-serif italic font-normal">
              its own space.
            </span>
          </h2>

          <p className="animate-text-top mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
            Create your free Jhankoo store. Share one simple link on
            Instagram, WhatsApp or anywhere.
          </p>

          {/* CTA */}
          <div ref={CTARef} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <button
              onClick={() => navigate("/auth")}
              className="animate-button group inline-flex w-full items-center justify-center gap-2  bg-neutral-900 px-7 py-3.5 text-sm font-medium text-white hover:-translate-y-1 hover:shadow-xl active:scale-95 sm:w-auto"
            >
              Create your store
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={() => {
                document
                  .getElementById("jhankoo-how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="animate-button inline-flex w-full items-center justify-center border border-neutral-300 bg-white/70 px-7 py-3.5 text-sm font-medium text-neutral-800 hover:-translate-y-1 hover:bg-white hover:shadow-md active:scale-95 sm:w-auto"
            >
              See how it works
            </button>

          </div>
        </div>


  
        <div ref={OneLinkWholeStoreRef} className="mt-24 sm:mt-32">

          <div className="mb-10 text-center">
            <p className="animate-text-middle text-sm font-medium uppercase tracking-[0.22em] text-neutral-500">
              One simple link
            </p>

            <h3 className="animate-text-middle mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              One link. Your whole store.
            </h3>

            <p className="animate-text-middle mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base">
              Everything your customer needs to buy from you, without the headache of endless DMs.
            </p>
          </div>



              <div className="animate-grid-card grid gap-5 md:grid-cols-3">

            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  style={{
                    backgroundImage: `url(${feature.bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    tranitionDelay: `${index * 70}ms`,
                  }}
                  className="group rounded-3xl border border-neutral-200 p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  // style={{
                  //   transitionDelay: `${index * 70}ms`,
                  // }}
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-neutral-900 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <h4 className="text-lg font-semibold text-neutral-900">
                    {feature.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-neutral-500">
                    {feature.text}
                  </p>
                </div>
              );
            })}

          </div>
        </div>



        <div
        ref={WhyJhankooRef}
          id="jhankoo-how-it-works"
          className=" mt-24 overflow-hidden rounded-[2rem] bg-neutral-900 px-7 py-12 text-white sm:px-12 lg:mt-32 lg:px-16 lg:py-16"
        >

          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>
              <p className=" animate-text-bottom text-sm font-medium uppercase tracking-[0.22em] text-neutral-400">
                Why Jhankoo
              </p>

              <h3 className="animate-text-bottom mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Made for independent small businesses.
              </h3>

              <p className="animate-text-bottom mt-5 max-w-lg text-sm leading-7 text-neutral-400 sm:text-base">
               You don't need to hire a developer, learn how to code, or struggle with complicated e-commerce platforms. Jhankoo handles the tech so you can focus entirely on running your business and serving your customers.
              </p>
            </div>


            <div className=" animate-grid grid gap-3 sm:grid-cols-2">

              {benefits.map((benefit, index) => (
                <div
                  key={benefit}
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                  style={{
                    transitionDelay: `${index * 60}ms`,
                  }}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-neutral-900">
                    <Check size={15} strokeWidth={2.5} />
                  </div>

                  <span className="text-sm text-neutral-200">
                    {benefit}
                  </span>
                </div>
              ))}

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default JhankooValueSection;