import React, { useMemo, useState } from "react";
import { ArrowRight, Search, MapPin, Sparkles, SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bookMarkImg from "../../assets/bookMark.webp";
import keychainsImg from "../../assets/keychains.webp";
import hanumanjiImg from "../../assets/hanumanji.webp";
import purseImg from "../../assets/purse.webp";

const DiscoverCreators = () => {
  const navigate = useNavigate();

  const creators = [
    {
      username: "mystriispot",
      name: "MystriiSpot",
      location: "Rishikesh",
      category: "Handmade Art",
      description: "Handmade with a little magic ✨",
      image: bookMarkImg,
      accent: "bg-orange-100",
    },
    {
      username: "theclaycorner",
      name: "TheClayCorner",
      location: "Dehradun",
      category: "Clay & Home Decor",
      description: "Dream it • Shape it • Love it",
      image: keychainsImg,
      accent: "bg-yellow-100",
    },
    {
      username: "threadandtales",
      name: "ThreadAndTales",
      location: "Rishikesh",
      category: "Crochet",
      description: "Crochet stories in every loop",
      image: hanumanjiImg,
      accent: "bg-green-100",
    },
    {
      username: "woodenwhimsy",
      name: "WoodenWhimsy",
      location: "Dehradun",
      category: "Wooden Decor",
      description: "Carved with care",
      image: purseImg,
      accent: "bg-amber-100",
    },
  ];

  const categories = ["All", "Handmade Art", "Clay & Home Decor", "Crochet", "Wooden Decor"];

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      const matchesSearch =
        creator.name.toLowerCase().includes(search.toLowerCase()) || creator.category.toLowerCase().includes(search.toLowerCase()) || creator.location.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = activeCategory === "All" || creator.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <main className="min-h-screen bg-[#faf7f0] text-neutral-900">
    

      <section className="relative overflow-hidden px-5 pb-14 pt-20 sm:px-8 sm:pt-24 lg:px-16 lg:pb-20">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-72 h-80 w-80 rounded-full bg-yellow-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-600 shadow-sm">
              <Sparkles size={14} />
              Discover independent creators
            </div>

            <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Discover people
              <span className="block font-serif italic font-normal text-neutral-600">behind the things they make.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
              Explore handmade artists, crafters and small creators. Visit their Jhankoo stores and discover the work they create with their own hands.
            </p>
          </div>

          {/* Search */}
          <div className="mt-10 max-w-2xl">
            <div className="group flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 shadow-sm transition-all duration-300 focus-within:border-neutral-400 focus-within:shadow-lg">
              <Search size={19} className="shrink-0 text-neutral-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search creators, categories or locations..."
                className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
              />

              {search && (
                <button onClick={() => setSearch("")} className="rounded-full p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* CREATOR CONTENT */}
      {/* ================================================= */}

      <section className="px-5 pb-24 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-6xl">
          {/* Toolbar */}

          <div className="flex flex-col gap-4 border-b border-neutral-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-neutral-500">{filteredCreators.length} creators</p>

              <h2 className="mt-1 text-xl font-semibold">Find your next favourite creator</h2>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md lg:hidden"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>

          {/* Filters */}

          <div className={`${showFilters ? "flex" : "hidden"} mt-5 flex-wrap gap-2 lg:flex`}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${activeCategory === category ? "bg-neutral-900 text-white shadow-md" : "border border-neutral-200 bg-white text-neutral-600 hover:-translate-y-0.5 hover:shadow-sm"}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Creator Grid */}

          {filteredCreators.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCreators.map((creator, index) => (
                <article
                  key={creator.username}
                  className="group overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  style={{
                    animationDelay: `${index * 80}ms`,
                  }}
                >
                  {/* Image */}

                  <div className={`relative aspect-[4/3] overflow-hidden ${creator.accent}`}>
                    <img src={creator.image} alt={creator.name} loading={index < 2 ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />

                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  {/* Content */}

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold tracking-tight">{creator.name}</h3>

                        <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500">
                          <MapPin size={13} />
                          {creator.location}
                        </div>
                      </div>
                    </div>

                    <p className="mt-5 text-sm leading-6 text-neutral-500">{creator.description}</p>

                    <div className="mt-5">
                      <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">{creator.category}</span>
                    </div>

                    <button
                      onClick={() => navigate(`/${creator.username}`)}
                      className="group/btn mt-6 flex w-full items-center justify-between rounded-xl bg-neutral-900 px-4 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-neutral-800 active:scale-[0.98]"
                    >
                      Visit store
                      <ArrowRight size={17} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Empty State */

            <div className="mt-12 rounded-[2rem] border border-dashed border-neutral-300 bg-white px-6 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                <Search size={22} className="text-neutral-500" />
              </div>

              <h3 className="mt-5 text-xl font-semibold">No creators found</h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">Try another creator name, category or location.</p>

              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="mt-6 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>


      {/* BOTTOM CTA */}


      <section className="border-t border-neutral-200 bg-white px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-[#f4ead9] px-7 py-14 text-center sm:px-12 lg:py-20">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">Are you a creator?</p>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Give your work a place of its own.</h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-600 sm:text-base">Create your Jhankoo store and share one simple link with your audience.</p>

          <button
            onClick={() => navigate("/auth")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95"
          >
            Create your store
            <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </main>
  );
};

export default DiscoverCreators;
