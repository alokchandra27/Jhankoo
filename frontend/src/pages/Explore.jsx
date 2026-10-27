import React, { useMemo, useRef, useState } from "react";
import { ArrowRight, Heart, Search, Sparkles, ShoppingBag, MessageCircle, Store, Link as LinkIcon, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "./Footer";
import bookMarkImg from "../assets/bookMark.webp";
import hanumanjiImg from "../assets/hanumanji.webp";
import sunflowerKeychainsImg from "../assets/sunflowerKeychains.webp";
import purseImg from "../assets/purse.webp";
import leafStemImg from "../assets/leafStem.webp";
import sunflowerImg from "../assets/sunflower.webp";
import crochetImg from "../assets/crochet.webp";
import paintsAndAllImg from "../assets/paintsandall.webp";
import keychainsImg from "../assets/keychains.webp";
import yarnImg from "../assets/yarn.webp";
import flowerDaisyImg from "../assets/flowerDaisy.webp";

gsap.registerPlugin(ScrollTrigger);

const Explore = () => {
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const products = [
    { id:"demo-1", name:"Bookmark Made With Clay", category:"Clay", price:49, creator:"MystriSpot", username:"mystrispot", image:bookMarkImg, description:"A handmade clay Bookmark created with care.", customizable:true },
    { id:"demo-2", name:"Hanuman ji figurine keychain", category:"Clay", price:599, creator:"MystriSpot", username:"mystrispot", image:hanumanjiImg, description:"Carry hanuman ji with you wherever you go.", customizable:false },
    { id:"demo-3", name:"Sun Flower Keychain", category:"Clay", price:149, creator:"MystriSpot ", username:"mystrispot", image:sunflowerKeychainsImg, description:"Keychain made from sunflowers that never fade.", customizable:true },
    { id:"demo-4", name:"Bag Charm Made With Clay", category:"Clay", price:249, creator:"MystriSpot", username:"mystrispot", image:purseImg, description:"A light and airy addition to your bag , ready to be personalized.", customizable:true },
  ];

  const categories = ["All","Clay","Crochet","Wood"];
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [favorites, setFavorites] = useState([]);

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter((p) =>
      (p.name.toLowerCase().includes(q) || p.creator.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) &&
      (category === "All" || p.category === category)
    );
  }, [search, category]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const visitStore = (username) => navigate(`/publicstore/${username}`);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".explore-hero-text", {
      y: 30,
      opacity: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: "power3.out",
    });

    tl.from(
      ".explore-hero-buttons",
      {
        y: 15,
        opacity: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: "power2.out",
      },
      "-=0.25"
    );

    tl.from(
      ".explore-collage-main",
      {
        scale: 0.94,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.25"
    );

    tl.from(
      ".explore-collage-side",
      {
        x: -35,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: "power3.out",
      },
      "-=0.4"
    );

    tl.from(
      ".explore-collage-decor",
      {
        y: 15,
        opacity: 0,
        duration: 0.35,
        stagger: 0.06,
        ease: "power2.out",
      },
      "-=0.25"
    );

    gsap.utils.toArray(".explore-scroll-section").forEach((section) => {
      gsap.from(section, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    });
  }, { scope: pageRef });

  return (
    <main ref={pageRef} className="min-h-screen overflow-x-hidden bg-[#faf7f0] text-neutral-900">
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-16 pt-20 sm:px-8 lg:px-16 lg:pb-24">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-yellow-200/20 blur-3xl" />

        <div className="pointer-events-none absolute left-[4%] top-[18%] hidden rotate-[-35deg] sm:block">
          <img src={leafStemImg} alt="" className="w-14 opacity-80 lg:w-20" />
        </div>
        <div className="pointer-events-none absolute right-[5%] top-[23%] hidden rotate-[18deg] sm:block">
          <img src={leafStemImg} alt="" className="w-14 opacity-70 lg:w-20" />
        </div>
        {/* <div className="pointer-events-none absolute bottom-[7%] right-[7%] hidden sm:block">
          <img src={sunflowerImg} alt="" className="w-16 rotate-[-8deg] z-50 lg:w-24" />
        </div> */}

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="explore-hero-content max-w-3xl">
              <div className="explore-hero-text mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-600 shadow-sm">
                <Sparkles size={14} /> Explore Jhankoo
              </div>

              <h1 className="explore-hero-text font-caveat text-6xl font-normal leading-[0.9] sm:text-7xl lg:text-8xl">
                Discover something
                <span className="block text-creator-pink">made by someone.</span>
              </h1>

              <p className="explore-hero-text mt-7 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
                Explore handmade pieces and independent creators, then jump straight to their own Jhankoo store to see the full collection and connect with them.
              </p>

              <div className="explore-hero-buttons mt-7 flex flex-wrap gap-3">
                <button onClick={() => document.getElementById("discover-section")?.scrollIntoView({behavior:"smooth"})}
                  className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  Start exploring <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
                <button onClick={() => navigate("/auth")}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-700 transition-all duration-300 hover:-translate-y-1 hover:bg-neutral-50">
                  I'm a creator
                </button>
              </div>

              <div className="explore-hero-text mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-neutral-500">
                <span className="inline-flex items-center gap-2"><Store size={15}/> Discover</span>
                <ArrowRight size={13} className="hidden text-neutral-300 sm:block"/>
                <span className="inline-flex items-center gap-2 cursor-pointer"><LinkIcon size={15}/> Visit their store</span>
                <ArrowRight size={13} className="hidden text-neutral-300 sm:block"/>
                <span className="inline-flex items-center gap-2"><MessageCircle size={15}/> Connect directly</span>
              </div>
            </div>

            {/* Visual collage */}
            <div className="explore-collage relative mx-auto h-[25rem] w-full max-w-[31rem] sm:h-[31rem]">
              <div className="explore-collage-main absolute left-[18%] top-[7%] z-10 h-[68%] w-[62%] rotate-6 overflow-hidden border-[9px] border-[#faf7f0] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.20)] sm:border-[12px]">
                <img src={crochetImg} alt="Handmade crochet artwork" className="h-full w-full object-cover"/>
              </div>
              <div className="explore-collage-side absolute left-[1%] top-[28%] z-20 h-[36%] w-[36%] -rotate-12 overflow-hidden border-[7px] border-[#faf7f0] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:border-[10px]">
                <img src={paintsAndAllImg} alt="Handmade art" className="h-full w-full object-cover"/>
              </div>
              <div className="explore-collage-side absolute bottom-[8%] right-[2%] z-30 h-[37%] w-[36%] rotate-12 overflow-hidden border-[7px] border-[#faf7f0] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:border-[10px]">
                <img src={keychainsImg} alt="Handmade keychains" className="h-full w-full object-cover"/>
              </div>
              <div className="explore-collage-decor absolute left-[3%] top-[8%] z-40 rotate-[-75deg]">
                <img src={leafStemImg} alt="" className="w-12 sm:w-16 lg:w-20"/>
              </div>
              <div className="explore-collage-decor absolute bottom-[2%] right-[20%] z-40">
                <img src={yarnImg} alt="" className="w-14 rotate-[-8deg] sm:w-20 lg:w-24 z-50"/>
              </div>
              <div className="explore-collage-decor absolute bottom-[17%] left-[12%] z-40">
                <img src={flowerDaisyImg} alt="" className="w-12 rotate-[-8deg] sm:w-16 lg:w-20"/>
              </div>
              <div className="absolute right-[4%] top-[3%] z-40 rotate-6 rounded-full bg-white px-4 py-2 font-caveat text-sm text-neutral-700 shadow-md sm:text-base">
                little things, made with love ♡
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="explore-scroll-section border-y border-neutral-200 bg-white/70 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="font-caveat text-xl text-creator-pink">for shoppers</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Explore is the starting point.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
            Jhankoo is not a marketplace. Explore helps you find a creator; their own store is where you see products and connect with them.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {n:"01", icon:Search, title:"Discover", text:"Find handmade products and independent creators that catch your eye."},
              {n:"02", icon:Store, title:"Visit their store", text:"Open the creator's personal Jhankoo store and browse their full collection."},
              {n:"03", icon:MessageCircle, title:"Connect directly", text:"Ask questions or place an order through the creator's Instagram or WhatsApp."}
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.n} className="explore-step-card relative rounded-3xl border border-neutral-200 bg-[#fffdf8] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white"><Icon size={17}/></div>
                    <span className="font-caveat text-xl text-neutral-300">{step.n}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-500">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DEMO STORE */}
      <section className="explore-scroll-section px-5 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-caveat text-xl text-creator-pink">see it in action</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">A creator's store, in real life.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-neutral-500">This is a demo store so you can understand what a creator's shared link can look like.</p>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
            <div className="relative overflow-hidden bg-neutral-900 px-7 py-10 text-white sm:px-10 lg:px-14">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-orange-300/10 blur-3xl"/>
              <div className="relative flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="inline-flex items-center gap-2  border border-white/20 bg-red-500 px-3 py-1.5 text-xs font-medium"><Sparkles size={13}/> DEMO CREATOR STORE</span>
                  <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Mystrispot</h2>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-neutral-300">Handmade with a little magic ✨</p>
                </div>
                <button onClick={() => visitStore("mystrispot")} className="group inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  Open creator store <ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/>
                </button>
              </div>
            </div>

            <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <div key={product.id} className="explore-product-card group bg-white p-4 transition-all duration-300 hover:bg-[#fffdf8]">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 "/>
                    <button onClick={() => toggleFavorite(product.id)} aria-label={`Favorite ${product.name}`} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-all duration-300 hover:scale-110 active:scale-95">
                      <Heart
                      onClick={() => {
                        toast.success(favorites.includes(product.id) ? "Removed from favorites" : "Added to favorites", {
                          // position: "top-right",
                          autoClose: 1500,
                        });
                      }}
                      size={17} className={favorites.includes(product.id) ? "fill-current text-red-500" : "text-neutral-700"}/>
                    </button>
                  </div>
                  <div className="px-1 pb-2 pt-5">
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="text-xs font-medium uppercase tracking-wide text-neutral-400">{product.category}</p><h3 className="mt-1 text-base font-semibold">{product.name}</h3></div>
                      <p className="shrink-0 text-sm font-semibold">₹{product.price}</p>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-500">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-neutral-500">by {product.creator}</span>
                      {product.customizable && <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-medium text-green-700">Customizable</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DISCOVERY */}
      <section id="discover-section" className="explore-scroll-section scroll-mt-20 px-5 pb-24 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-white px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
            <div className="pointer-events-none absolute right-7 top-7 rotate-12 opacity-60"><img src={leafStemImg} alt="" className="w-12 lg:w-16"/></div>
            {/* <div className="pointer-events-none absolute bottom-5 right-12 z-50"><img src={sunflowerImg} alt="" className="w-14 rotate-[-10deg] lg:w-20"/></div> */}

            <div className="relative">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="font-caveat text-xl text-creator-pink">discover</p>
                  <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Find something you love.</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
                    The discovery experience is being built. For now, use the demo below to understand how browsing creators will work.
                  </p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-800"><Sparkles size={14}/> Search coming soon</span>
              </div>

              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3.5 text-neutral-400">
                <Search size={19} className="shrink-0"/>
                <span className="text-sm">Search products, creators or categories...</span>
                <span className="ml-auto hidden rounded-full bg-white px-3 py-1 text-[10px] font-medium text-neutral-400 shadow-sm sm:block">Coming soon</span>
              </div>

              <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
                {categories.map((item) => (
                  <button key={item} onClick={() => setCategory(item)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm transition-all duration-300 ${category === item ? "bg-neutral-900 text-white shadow-md" : "border border-neutral-200 bg-white text-neutral-600 hover:-translate-y-0.5 hover:shadow-sm"}`}>
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map((product, index) => (
                  <article key={product.id} className="explore-product-card group overflow-hidden rounded-3xl border border-neutral-200 bg-[#fffdf8] transition-all duration-500 hover:-translate-y-2 hover:shadow-xl" style={{transitionDelay:`${index*60}ms`}}>
                    <div className="relative aspect-square overflow-hidden bg-neutral-100">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                      <button onClick={() => toggleFavorite(product.id)} aria-label={`Favorite ${product.name}`} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-all duration-300 hover:scale-110 active:scale-95">
                        <Heart size={17} className={favorites.includes(product.id) ? "fill-current text-red-500" : "text-neutral-700"}/>
                      </button>
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">{product.category}</p>
                      <div className="mt-1 flex items-start justify-between gap-3"><h3 className="font-semibold">{product.name}</h3><span className="shrink-0 text-sm font-semibold">₹{product.price}</span></div>
                      <p className="mt-2 text-xs leading-5 text-neutral-500">{product.description}</p>
                      <div className="mt-4 flex items-center gap-2"><div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-semibold">{product.creator.charAt(0)}</div><span className="text-xs text-neutral-500">{product.creator}</span></div>
                      <button onClick={() => visitStore(product.username)} className="group/btn mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-neutral-800 active:scale-[0.98] cursor-pointer">
                        Visit creator store <ArrowRight size={15} className="transition-transform duration-300 group-hover/btn:translate-x-1"/>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOR CREATORS */}
      <section className="explore-scroll-section relative overflow-hidden bg-neutral-900 px-5 py-20 text-white sm:px-8 lg:px-16">
        <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-orange-300/10 blur-3xl"/>
        <div className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-yellow-200/10 blur-3xl"/>

        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="font-caveat text-2xl text-orange-200">for creators</p>
              <h2 className="mt-2 max-w-lg font-caveat text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">Your Instagram can lead somewhere.</h2>
              <p className="mt-6 max-w-lg text-sm leading-7 text-neutral-300 sm:text-base">
                Instead of sending people product photos one by one in DMs, give them one simple Jhankoo link where they can see your work, products, prices and ways to contact you.
              </p>
              <button onClick={() => navigate("/auth")} className="group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                Create your store <ArrowRight size={17} className="transition-transform group-hover:translate-x-1"/>
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {icon:UserPlus,title:"Create your space",text:"Set up your creator profile and store."},
                {icon:ShoppingBag,title:"Add your products",text:"Show your pieces, prices and details."},
                {icon:LinkIcon,title:"Share one link",text:"Put your store link in your Instagram bio."},
                {icon:MessageCircle,title:"Get direct enquiries",text:"Let customers reach you on WhatsApp or Instagram."}
              ].map((item) => {
                const Icon=item.icon;
                return <div key={item.title} className="explore-creator-card rounded-3xl border border-white/10 bg-white/[0.05] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08]">
                  <Icon size={19} className="text-orange-200"/>
                  <h3 className="mt-5 text-sm font-semibold">{item.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">{item.text}</p>
                </div>;
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="explore-scroll-section relative overflow-hidden border-t border-neutral-200 bg-[#fffdf8] px-5 py-20 sm:px-8 lg:px-16">
        <div className="pointer-events-none absolute left-[10%] top-8 rotate-[-18deg]"><img src={leafStemImg} alt="" className="w-12 opacity-60"/></div>
        <div className="pointer-events-none absolute bottom-8 right-[12%]"><img src={yarnImg} alt="" className="w-16 rotate-6 z-50"/></div>
        <div className="relative mx-auto max-w-4xl text-center">
          <Sparkles size={24} className="mx-auto text-neutral-500"/>
          <h2 className="mt-5 font-caveat text-5xl font-normal leading-none sm:text-6xl">Something handmade is waiting.</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base">
            Explore the demo, visit a creator's store and see how Jhankoo turns a simple shared link into a little home for their work.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={() => document.getElementById("discover-section")?.scrollIntoView({behavior:"smooth"})}
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              Explore creators <ArrowRight size={17}/>
            </button>
            <button onClick={() => navigate("/auth")}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-7 py-3.5 text-sm font-medium text-neutral-700 transition-all duration-300 hover:-translate-y-1 hover:bg-neutral-50">
              I'm a creator
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer/>
    </main>
  );
};

export default Explore;
