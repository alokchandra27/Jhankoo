import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Palette, UserRound, ArrowRight, Link2, MessageCircle, Package, Store } from 'lucide-react'
import leafStemImg from "../../assets/leafStem.webp";

gsap.registerPlugin(ScrollTrigger);

const HowJhankooWorks = () => {
  const sectionRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const bottomFlowRef = useRef(null);

  useGSAP(() => {
    // 1. Header Text Animation
    gsap.from(".animate-work-header", {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    });

    // 2. Steps Cards Stagger Animation
    gsap.from(".animate-work-card", {
      scrollTrigger: {
        trigger: cardsContainerRef.current,
        start: "top 75%",
        toggleActions: "play none none none",
      },
      x: -40,
      opacity: 0,
      duration: 0.65,
      stagger: 0.3, // Ek ke baad ek saare card aayenge
      ease: "power3.out"
    });

    // 3. Bottom Flow Box Animation
    gsap.from(".animate-work-flow", {
      scrollTrigger: {
        trigger: bottomFlowRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    });

  }, { scope: sectionRef }); // Safe implementation inside empty dependency frame

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#FFFDF9] px-6 py-20 sm:px-10 md:py-24 lg:px-16">
        <img
          src={leafStemImg}
          loading="lazy"
          fetchPriority="low"
          decoding="async"
          alt=""
          className="pointer-events-none absolute -left-5 top-8 w-20 rotate-[-35deg] opacity-50 sm:w-28"
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="animate-work-header font-caveat text-lg text-creator-pink sm:text-xl">
              Simple by steps. Big impact.
            </p>

            <h2
              className="animate-work-header mt-1 font-playfair text-3xl font-bold text-neutral-800 sm:text-4xl md:text-5xl"
            >
              How Jhankoo Works
            </h2>
          </div>

          {/* Added cardsContainerRef for flawless trigger point */}
          <div
            ref={cardsContainerRef}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-5"
          >      
            {/* STEP 1 */}
            <div className="animate-work-card group relative">
              <div
                className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-creator-pink transition-transform duration-300 group-hover:scale-110"
              >
                <UserRound size={23} />
              </div>

              <span className="text-xs font-bold text-creator-pink">01</span>

              <h3 className="mt-2 font-semibold text-neutral-800">
                Create your storefront
              </h3>

              <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-500">
               Set up your online store in minutes and give your independent business a professional home on the internet.
              </p>
            </div>

            {/* STEP 2 */}
            <div className="animate-work-card group relative">
              <div
                className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700 transition-transform duration-300 group-hover:scale-110"
              >
                <Palette size={23} />
              </div>

              <span className="text-xs font-bold text-green-700">02</span>

              <h3 className="mt-2 font-semibold text-neutral-800">
                 List your products
              </h3>

              <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-500">
                Add your items, set prices, upload high-quality images, and add custom order options or variants easily.
              </p>
            </div>

            {/* STEP 3 */}
            <div className="animate-work-card group relative">
              <div
                className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-yellow-700 transition-transform duration-300 group-hover:scale-110"
              >
                <Link2 size={23} />
              </div>

              <span className="text-xs font-bold text-yellow-700">03</span>

              <h3 className="mt-2 font-semibold text-neutral-800">
                Share your store link
              </h3>

              <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-500">
                Paste your unique Jhankoo link directly into your Instagram bio, WhatsApp Business profile, or share it anywhere else.
              </p>
            </div>

            {/* STEP 4 */}
            <div className="animate-work-card group relative">
              <div
                className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-700 transition-transform duration-300 group-hover:scale-110"
              >
                <Package size={23} />
              </div>

              <span className="text-xs font-bold text-purple-700">04</span>

              <h3 className="mt-2 font-semibold text-neutral-800">
               Receive direct orders
              </h3>

              <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-500">
                Customers browse your organized store and place an order or connect with you seamlessly to finalize the sale.
              </p>
            </div>
          </div>

          {/* Bottom Flow Link Card with bottomFlowRef */}
          <div
            ref={bottomFlowRef}
            className="animate-work-flow mt-16 flex flex-col items-center justify-center gap-4 rounded-3xl border border-neutral-100 bg-white px-6 py-6 shadow-sm sm:flex-row sm:gap-6"
          >
            <div className="flex items-center gap-2 text-creator-pink">
              <Link2 size={18} />
              <span className="text-xs font-medium">Instagram</span>
            </div>

            <ArrowRight
              size={15}
              className="hidden text-neutral-300 sm:block"
            />

            <div className="flex items-center gap-2 text-green-600">
              <Store size={18} />
              <span className="text-xs font-medium">Jhankoo Store</span>
            </div>

            <ArrowRight
              size={15}
              className="hidden text-neutral-300 sm:block"
            />

            <div className="flex items-center gap-2 text-green-700">
              <MessageCircle size={18} />
              <span className="text-xs font-medium">Direct Order</span>
            </div>
          </div>
        </div>
      </section>
  )
}

export default HowJhankooWorks
