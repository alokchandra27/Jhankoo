// import React from 'react'
// import bannerImg from "../../assets/banner.webp";
// import {ArrowRight, Sparkles} from "lucide-react";

// const Hero = () => {
//   return (
    
//         <section
//           className="relative grid overflow-hidden rounded-[28px] bg-creator-bg shadow-[0_18px_55px_rgba(82,60,42,0.08)] lg:grid-cols-[0.86fr_1.14fr]"
//         >

//           {/* DECORATIVE BRUSH */}

//           <div
//             className="pointer-events-none absolute -left-7 top-16 h-10 w-28 rotate-[-12deg] rounded-full bg-creator-pink/20 blur-[1px]"
//           />


//           {/* HERO TEXT */}

//           <div
//             className="relative z-10 flex min-h-[350px] flex-col justify-center gap-2 px-7 py-10 sm:px-12 lg:min-h-[440px] lg:px-14"
//           >

//             {/* handwritten mini label */}

//             <div className="mb-4 flex items-center gap-2">

//               <Sparkles
//                 size={14}
//                 className="text-creator-pink"
//               />

//               <span
//                 className="font-caveat text-lg text-creator-text/70"
//               >
//                 a little handmade world
//               </span>

//             </div>


//             <h1
//               className="max-w-md font-caveat text-5xl font-normal leading-[0.9] text-creator-text sm:text-7xl"
//             >
//               Made by hand,

//               <span className="block text-creator-pink">
//                 made for you.
//               </span>
//             </h1>


//             <p
//               className="mt-5 max-w-sm text-sm leading-6 text-creator-text/60 sm:text-base"
//             >
//               Discover thoughtful pieces from{" "}
//               <span
//                 className="font-semibold underline decoration-creator-pink decoration-2 underline-offset-4"
//               >
//                 {store?.storeName ||
//                   "a small creator"}
//               </span>
//               , made slowly and shared with love.
//             </p>


//             <a
//               href="#collection"
//               className="group mt-7 flex w-fit items-center gap-2 rounded-full bg-creator-pink px-5 py-3 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:rotate-[-1deg] hover:shadow-lg active:scale-95"
//             >
//               Explore the collection

//               <ArrowRight
//                 size={15}
//                 className="transition-transform duration-300 group-hover:translate-x-1"
//               />
//             </a>


//             {/* little handwritten detail */}

//             <span
//               className="absolute bottom-7 right-8 hidden rotate-[-5deg] font-caveat text-lg text-creator-text/60 sm:block"
//             >
//               made with love ♡
//             </span>

//           </div>


//           {/* HERO IMAGE */}

//           <div
//             className="relative min-h-[270px] overflow-hidden lg:min-h-[440px]"
//           >

//             <img
//               src={getImageUrl(
//                 store?.bannerImage,
//                 bannerImg,
//               )}
//               alt="Store banner"
//               loading="eager"
//               fetchPriority="high"
//               decoding="sync"
//               className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.035]"
//             />


//             <div
//               className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
//             />


//             {/* taped-note feeling */}

//             <div
//               className="absolute bottom-7 left-7 rotate-[-4deg] bg-white/90 px-4 py-2 font-caveat text-sm shadow-sm backdrop-blur transition-transform duration-300 hover:rotate-2"
//             >
//               handmade
//               <br />
//               with love ♡
//             </div>


//             <span
//               className="absolute bottom-5 right-5 rotate-[2deg] rounded-full bg-white/90 px-3 py-2 font-caveat text-sm font-semibold text-creator-text shadow-sm transition-all duration-300 hover:-rotate-3 hover:scale-105"
//             >
//               small business · big heart
//             </span>

//           </div>

//         </section>

//   )
// }

// export default Hero