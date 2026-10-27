import React, { useRef } from "react";
import {
  ArrowRight,
  MessageCircle,
  Search,
  Lightbulb,
  Store,
  Heart,
//   Instagram,
  Sparkles,
  ArrowDown,
  BoomBox,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import flowerDaisyImg from "../assets/flowerDaisy.webp";
import yarnImg from "../assets/yarn.webp";
import leafStemImg from "../assets/leafStem.webp";

gsap.registerPlugin(ScrollTrigger);

const OurStory = () => {
  const navigate = useNavigate();
  const pageRef = useRef(null);

  useGSAP(() => {
    const sections = gsap.utils.toArray(".story-scroll-section");

    sections.forEach((section, index) => {
      if (index === 0) {
        gsap.fromTo(
          section,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: "power3.out",
          }
        );
        return;
      }

      gsap.fromTo(
        section,
        { opacity: 0, y: 45 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    });
  }, { scope: pageRef });

  const goToAuth = () => {
    navigate("/auth");
  };

  const goToHome = () => {
    navigate("/");
  };

  const scrollToStory = () => {
    document
      .getElementById("story-start")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main ref={pageRef} className="w-full overflow-x-hidden bg-[#f8f3e8] text-neutral-900">

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="story-scroll-section relative min-h-[88vh] overflow-hidden px-6 py-20 sm:px-10 md:py-24 lg:px-16 lg:py-28">

        {/* Decorative elements */}

        <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -left-32 bottom-10 h-80 w-80 rounded-full bg-pink-200/30 blur-3xl" />

        <img
          src={flowerDaisyImg}
          alt=""
          loading="lazy"
          fetchPriority="low"
          decoding="async"
          className="pointer-events-none absolute left-[4%] top-[15%] w-16 rotate-[-18deg] opacity-70 sm:w-24"
        />

        {/* <img
          src={yarnImg}
          alt=""
          className="pointer-events-none absolute bottom-[8%] right-[5%] w-20 rotate-12 opacity-70 sm:w-28 z-10"
        /> */}

        <div className="relative mx-auto flex min-h-[75vh] max-w-6xl items-center">

          <div className="grid w-full items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">

            {/* LEFT */}

            <div className="text-center lg:text-left">

              <p className="mb-5 font-caveat text-xl text-creator-pink sm:text-2xl">
                This didn't start with a business plan.
              </p>

              <h1 className="font-playfair text-5xl font-bold leading-[1.05] text-neutral-900 sm:text-6xl md:text-7xl">
                It started with a
                <span className="block font-caveat font-normal text-creator-pink">
                  problem.
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg lg:mx-0">
                I kept seeing small creators and independent businesses
                building something they genuinely cared about — but their
                products, information and orders were scattered everywhere.
              </p>

              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg lg:mx-0">
                Jhankoo started from a simple question:
              </p>

              <div className="mt-6 inline-block max-w-xl border-l-4 border-creator-pink pl-5 text-left">
                <p className="font-playfair text-xl italic leading-8 text-neutral-800 sm:text-2xl">
                  "What if a small business could have its own simple online
                  store without having to build a whole website?"
                </p>
              </div>

              <button
                onClick={scrollToStory}
                className="group mt-9 inline-flex items-center gap-2 text-sm font-medium text-neutral-700 transition-all hover:text-creator-pink"
              >
                Read the story
                <ArrowDown
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-y-1"
                />
              </button>
            </div>

            {/* RIGHT VISUAL */}

            <div className="relative mx-auto h-[390px] w-full max-w-[470px] sm:h-[480px]">

              {/* Main paper */}

              <div className="absolute left-[10%] top-[8%] h-[72%] w-[78%] rotate-3 bg-white p-3 shadow-[0_25px_60px_rgba(0,0,0,0.12)] sm:p-4">

                <div className="flex h-full flex-col justify-between border border-neutral-200 p-6 sm:p-8">

                  <div>
                    <p className="font-caveat text-lg text-creator-pink sm:text-xl">
                      Somewhere between...
                    </p>

                    <h3 className="mt-3 font-playfair text-3xl font-semibold leading-tight sm:text-4xl">
                      Instagram
                      <br />
                      WhatsApp
                      <br />
                      DMs
                    </h3>
                  </div>

                  <div>
                    <div className="h-px w-full bg-neutral-200" />

                    <p className="mt-4 text-sm leading-6 text-neutral-500">
                      Products in one place.
                      <br />
                      Conversations somewhere else.
                      <br />
                      Orders hidden in between.
                    </p>
                  </div>

                </div>
              </div>

              {/* Floating note */}

              <div className="absolute right-0 top-[3%] z-20 rotate-6 bg-[#fff8cf] px-5 py-4 shadow-lg sm:right-[2%] sm:px-6 sm:py-5">

                <MessageCircle
                  size={22}
                  className="mb-2 text-neutral-700"
                />

                <p className="font-caveat text-lg leading-tight sm:text-xl">
                  "Price?"
                  <br />
                  "How can I order?"
                </p>

              </div>

              {/* Floating Instagram */}

              <div className="absolute bottom-[7%] left-0 z-30 -rotate-6 bg-white px-5 py-4 shadow-xl sm:left-[3%] sm:px-6 sm:py-5">

                {/* <Instagram
                  size={23}
                  className="mb-2 text-creator-pink"
                /> */}

                <p className="text-xs font-medium text-neutral-500">
                  The audience was already there.
                </p>

                <p className="mt-1 font-semibold">
                  The store wasn't.
                </p>

              </div>

              {/* Small decorative flower */}

              <img
                src={flowerDaisyImg}
                alt=""
                loading="lazy"
                fetchPriority="low"
                decoding="async"
                className="absolute bottom-[18%] right-[1%] z-40 w-16 rotate-12 sm:w-20"
              />

            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          STORY START
      ========================================================= */}

      <section
        id="story-start"
        className="story-scroll-section bg-white px-6 py-20 sm:px-10 md:py-28 lg:px-16"
      >

        <div className="mx-auto max-w-6xl">

          {/* Section heading */}

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-caveat text-xl text-creator-pink sm:text-2xl">
              So, I started looking closer.
            </p>

            <h2 className="mt-3 font-playfair text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              The problem wasn't
              <span className="block font-caveat font-normal">
                a lack of effort.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-500 sm:text-lg">
              Small businesses were already doing the hard part — creating,
              selling, promoting and talking to customers.
              The problem was how everything was connected.
            </p>

          </div>


          {/* Problem cards */}

          <div className="mt-16 grid gap-5 md:grid-cols-3">

            <StoryCard
              icon={BoomBox}
              number="01"
              title="Their audience was on Instagram."
              text="Creators were already using reels, posts and stories to show what they make and build an audience around it."
            />

            <StoryCard
              icon={MessageCircle}
              number="02"
              title="Their orders lived in conversations."
              text="Customers asked about prices, availability, customization and delivery through DMs and WhatsApp."
            />

            <StoryCard
              icon={Search}
              number="03"
              title="Their products were scattered."
              text="A customer often had to search through posts, highlights or messages just to understand what was actually available."
            />

          </div>

        </div>
      </section>


      {/* =========================================================
          CONVERSATIONS / OBSERVATION
      ========================================================= */}

      <section className="story-scroll-section relative overflow-hidden bg-[#f8f3e8] px-6 py-20 sm:px-10 md:py-28 lg:px-16">

        <img
          src={leafStemImg}
          alt=""
          loading="lazy"
          fetchPriority="low"
          decoding="async"
          className="pointer-events-none absolute left-[2%] top-[10%] w-20 -rotate-45 opacity-50 sm:w-28"
        />

        <div className="relative mx-auto max-w-6xl">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* Left */}

            <div>

              <p className="font-caveat text-xl text-creator-pink sm:text-2xl">
                Then came the conversations.
              </p>

              <h2 className="mt-3 font-playfair text-4xl font-bold leading-tight sm:text-5xl">
                I didn't want to build
                <span className="block font-caveat font-normal text-creator-pink">
                  another random app.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg">
                The idea became more meaningful when I started looking at the
                actual way small businesses were working.
              </p>

              <p className="mt-4 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg">
                The goal wasn't to replace Instagram, WhatsApp or the
                platforms creators already use.
              </p>

              <div className="mt-8 flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Heart size={20} className="text-creator-pink" />
                </div>

                <p className="text-base font-medium leading-7 text-neutral-800">
                  The goal was to make the existing way of selling feel
                  simpler and more organized.
                </p>

              </div>

            </div>


            {/* Right — conversation cards */}

            <div className="relative min-h-[390px]">

              <div className="absolute left-[5%] top-[5%] w-[78%] rotate-[-4deg] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.10)] sm:p-8">

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100">
                    <MessageCircle size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Customer
                    </p>

                    <p className="mt-2 text-sm leading-6 text-neutral-700">
                      "How much is this?"
                    </p>

                    <p className="mt-2 text-sm leading-6 text-neutral-700">
                      "Can I customize it?"
                    </p>
                  </div>

                </div>

              </div>


              <div className="absolute right-[2%] top-[30%] z-10 w-[78%] rotate-[5deg] bg-[#fff8cf] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.10)] sm:p-8">

                <p className="font-caveat text-lg text-neutral-600">
                  Creator
                </p>

                <p className="mt-2 text-base leading-7 text-neutral-800">
                  "Everything is available through DM."
                </p>

                <div className="mt-5 h-px bg-neutral-300/60" />

                <p className="mt-4 text-xs leading-5 text-neutral-500">
                  The conversation works.
                  <br />
                  Finding the information shouldn't be this hard.
                </p>

              </div>


              <div className="absolute bottom-[3%] left-[8%] z-20 w-[70%] rotate-[-3deg] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.10)] sm:p-8">

                <p className="font-caveat text-xl text-creator-pink">
                  That's where the idea clicked.
                </p>

                <div className="mt-4 flex items-center gap-3">

                  <div className="h-px flex-1 bg-neutral-200" />

                  <Lightbulb size={21} />

                  <div className="h-px flex-1 bg-neutral-200" />

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          THE IDEA
      ========================================================= */}

      <section className="story-scroll-section bg-white px-6 py-20 sm:px-10 md:py-28 lg:px-16">

        <div className="mx-auto max-w-5xl text-center">

          <p className="font-caveat text-xl text-creator-pink sm:text-2xl">
            And then the question changed.
          </p>

          <h2 className="mx-auto mt-3 max-w-4xl font-playfair text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            What if they didn't need
            <span className="block font-caveat font-normal text-creator-pink">
              a full website?
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-neutral-500 sm:text-lg">
            What if a creator could simply have one link — a place where
            customers could see their products, understand their brand and
            reach them directly?
          </p>


          {/* Idea visual */}

          <div className="relative mx-auto mt-16 max-w-4xl">

            <div className="grid overflow-hidden rounded-[2rem] border border-neutral-200 bg-[#f8f3e8] shadow-sm md:grid-cols-3">

              <IdeaBlock
                icon={Store}
                title="Your products"
                text="Organized in one place."
              />

              <IdeaBlock
                icon={Heart}
                title="Your story"
                text="Your brand stays personal."
              />

              <IdeaBlock
                icon={MessageCircle}
                title="Your customers"
                text="Connect directly through the DMs."
              />

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          BUILDING CREATORLY
      ========================================================= */}

      <section className="story-scroll-section bg-neutral-900 px-6 py-20 text-white sm:px-10 md:py-28 lg:px-16">

        <div className="mx-auto max-w-6xl">

          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">

            {/* Heading */}

            <div>

              <p className="font-caveat text-xl text-pink-300 sm:text-2xl">
                Then I started building.
              </p>

              <h2 className="mt-3 font-playfair text-4xl font-bold leading-tight sm:text-5xl">
                From a simple
                <span className="block font-caveat font-normal text-pink-300">
                  idea to Jhankoo.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-neutral-400 sm:text-base">
                The idea sounded simple.
                Building it was where things became real.
              </p>

            </div>


            {/* Timeline */}

            <div className="relative">

              <div className="absolute left-[15px] top-3 h-[calc(100%-24px)] w-px bg-white/10" />

              <TimelineItem
                number="01"
                title="Understand the problem"
                text="Start with the way small businesses actually sell instead of designing the product around assumptions."
              />

              <TimelineItem
                number="02"
                title="Design the store experience"
                text="Keep the customer journey simple — discover the products, understand them and contact the creator."
              />

              <TimelineItem
                number="03"
                title="Build the foundation"
                text="Authentication, stores, products, images, public storefronts and the systems behind them."
              />

              <TimelineItem
                number="04"
                title="Keep it simple"
                text="No unnecessary customer accounts. No complicated checkout. No attempt to replace the platforms creators already depend on."
              />

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          WHAT CREATORLY IS
      ========================================================= */}

      <section className="story-scroll-section bg-[#f8f3e8] px-6 py-20 sm:px-10 md:py-28 lg:px-16">

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-caveat text-xl text-creator-pink sm:text-2xl">
              So, what is Jhankoo?
            </p>

            <h2 className="mt-3 font-playfair text-4xl font-bold leading-tight sm:text-5xl">
              Not another place to
              <span className="block font-caveat font-normal">
                compete for attention.
              </span>
            </h2>

            <p className="mt-6 text-base leading-7 text-neutral-500 sm:text-lg">
              Jhankoo is built to give small businesses a simple home for
              the things they are already creating and selling.
            </p>

          </div>


          <div className="mt-14 grid gap-5 md:grid-cols-3">

            <MeaningCard
              number="01"
              title="Instagram brings the people."
              text="Creators can continue using Instagram to build their audience and tell their story."
            />

            <MeaningCard
              number="02"
              title="Jhankoo organizes the store."
              text="Products, information and the brand experience can live together in one simple link."
            />

            <MeaningCard
              number="03"
              title="Conversations stay personal."
              text="Customers will reach the brand through the channels they already use."
            />

          </div>

        </div>
      </section>


      {/* =========================================================
          FOUNDER NOTE
      ========================================================= */}

      <section className="story-scroll-section bg-white px-6 py-20 sm:px-10 md:py-28 lg:px-16">

        <div className="mx-auto max-w-4xl">

          <div className="relative overflow-hidden rounded-[2rem] bg-[#FBE8EA] px-7 py-12 sm:px-12 sm:py-16">

            <img
              src={flowerDaisyImg}
              alt=""
              loading="lazy"
              fetchPriority="low"
              decoding="async"
              className="absolute -bottom-5 -left-3 w-24 rotate-[-15deg] opacity-70 sm:w-32"
            />

            <img
              src={flowerDaisyImg}
              alt=""
              loading="lazy"
              fetchPriority="low"
              decoding="async"
              className="absolute -right-5 bottom-0 w-24 rotate-12 opacity-70 sm:w-32"
            />

            <div className="relative z-10 text-center">

              <Sparkles
                size={25}
                className="mx-auto text-creator-pink"
              />

              <p className="mt-5 font-caveat text-xl text-creator-pink sm:text-2xl">
                One thing I want to keep true.
              </p>

              <h2 className="mt-3 font-playfair text-3xl font-bold leading-tight text-neutral-800 sm:text-4xl md:text-5xl">
                Build for real problems.
                <br />
                Keep people at the centre.
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                Jhankoo will keep evolving as I learn more about the people
                who use it. The goal is not to make small businesses fit into
                complicated software — it is to make the software fit the way
                they actually work.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="story-scroll-section relative mx-4 mb-6 overflow-hidden rounded-[2.5rem] bg-neutral-900 px-6 py-16 text-white sm:mx-6 sm:px-10 md:py-20 lg:mx-10">

        {/* <img
          src={flowerDaisyImg}
          alt=""
          className="absolute -bottom-4 left-3 w-20 rotate-[-15deg] opacity-60 sm:left-8 sm:w-28"
        />

        <img
          src={yarnImg}
          alt=""
          loading="lazy"
          fetchPriority="low"
          decoding="async"
          className="absolute -right-2 bottom-0 w-20 rotate-12 opacity-60 sm:right-8 sm:w-28"
        /> */}

        <div className="relative z-10 mx-auto max-w-3xl text-center">

          <p className="font-caveat text-xl text-pink-300 sm:text-2xl">
            Maybe your business is exactly who Jhankoo was made for.
          </p>

          <h2 className="mt-4 font-playfair text-4xl font-bold leading-tight sm:text-5xl">
            Give your work
            <span className="block font-caveat font-normal text-pink-300">
              its own space.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-neutral-400 sm:text-base">
            Create a simple storefront, share one link and let your customers
            find everything they need in one place.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <button
              onClick={goToAuth}
              className="group flex w-full items-center justify-center gap-2 bg-white px-7 py-3.5 text-sm font-medium text-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-auto"
            >
              Create your store
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={goToHome}
              className="flex w-full items-center justify-center border border-white/20 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 sm:w-auto"
            >
              Back to Jhankoo
            </button>

          </div>

        </div>

      </section>

      {/* Footer */}
      <Footer/>

    </main>
  );
};


/* =============================================================
   SMALL REUSABLE COMPONENTS
============================================================= */

const StoryCard = ({ icon: Icon, number, title, text }) => {
  return (
    <div className="group rounded-3xl border border-neutral-200 bg-[#f8f3e8] p-7 transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-xl sm:p-8">

      <div className="flex items-center justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition-all duration-300 group-hover:bg-neutral-900 group-hover:text-white">
          <Icon size={21} />
        </div>

        <span className="font-caveat text-xl text-neutral-300">
          {number}
        </span>

      </div>

      <h3 className="mt-7 text-xl font-semibold leading-snug text-neutral-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-neutral-500">
        {text}
      </p>

    </div>
  );
};


const IdeaBlock = ({ icon: Icon, title, text }) => {
  return (
    <div className="group border-b border-neutral-200 p-8 text-center transition-all duration-300 hover:bg-white md:border-b-0 md:border-r last:border-r-0">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-neutral-900 group-hover:text-white">
        <Icon size={22} />
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-neutral-500">
        {text}
      </p>

    </div>
  );
};


const TimelineItem = ({ number, title, text }) => {
  return (
    <div className="relative flex gap-6 pb-10 last:pb-0">

      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-300 text-xs font-bold text-neutral-900">
        {number}
      </div>

      <div>

        <h3 className="text-lg font-semibold text-white sm:text-xl">
          {title}
        </h3>

        <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-400 sm:text-base">
          {text}
        </p>

      </div>

    </div>
  );
};


const MeaningCard = ({ number, title, text }) => {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg sm:p-8">

      <span className="font-caveat text-2xl text-creator-pink">
        {number}
      </span>

      <h3 className="mt-4 text-xl font-semibold leading-snug">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-neutral-500">
        {text}
      </p>

    </div>
  );

  
};


export default OurStory;