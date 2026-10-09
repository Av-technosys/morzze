"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "@/hooks/appLink"
import { motion, AnimatePresence } from "framer-motion";
import {
  IconSearch,
  IconUser,
  IconShoppingBag,
  IconMenu2,
  IconX,
  IconHeart,
  IconLoader2,
  IconArrowRight,
} from "@tabler/icons-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { isUserLoggedIn } from "@/helper/auth/action";
import { getImageURL } from "@/lib/getImageLin";
import { LogIn } from "lucide-react";
import { imageKitUrl } from "@/lib/imagekit-url";

type SearchProduct = {
  id: string;
  name: string | null;
  slug: string | null;
  basePrice: number | null;
  strikethroughPrice: number | null;
  bannerImage: string | null;
  sku: string | null;
};

type SearchCategory = {
  id: string;
  name: string;
  slug: string;
  type?: "kitchen" | "bathroom" | null;
  bannerImage: string | null;
};

// ─── Shared search results dropdown ────────────────────────────────
function SearchResults({
  query,
  products,
  categories,
  isLoading,
  onNavigate,
}: {
  query: string;
  products: SearchProduct[];
  categories: SearchCategory[];
  isLoading: boolean;
  onNavigate: () => void;
}) {
  const hasResults = products.length > 0 || categories.length > 0;

  if (!query || query.length < 2) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full left-0 right-0 mt-1 bg-[#111] border border-zinc-800 rounded-lg shadow-2xl shadow-black/60 overflow-hidden z-[200] max-h-[70vh] overflow-y-auto custom-scrollbar"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8 gap-2 text-zinc-500 text-sm">
          <IconLoader2 size={18} className="animate-spin" />
          Searching…
        </div>
      ) : !hasResults ? (
        <div className="py-8 text-center text-zinc-500 text-sm font-inter">
          No results for &quot;{query}&quot;
        </div>
      ) : (
        <>
          {/* Categories */}
          {categories.length > 0 && (
            <div className="px-4 pt-3 pb-1">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2 font-montserrat">
                Categories
              </p>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/${cat.type || "kitchen"}/${cat.slug}`}
                    onClick={onNavigate}
                    aria-label={`Go to ${cat.name} category`}
                    className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-zinc-800/60 transition-colors group"
                  >
                    {cat.bannerImage ? (
                      <div className="w-8 h-8 rounded bg-zinc-900 overflow-hidden shrink-0">
                        <Image
                          src={getImageURL(cat.bannerImage)}
                          alt={cat.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded bg-zinc-900 shrink-0 flex items-center justify-center text-zinc-700 text-xs font-bold">
                        {cat.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm text-zinc-300 group-hover:text-[#FFBF3F] transition-colors font-inter">
                      {cat.name}
                    </span>
                    <IconArrowRight
                      size={14}
                      className="ml-auto text-zinc-700 group-hover:text-[#FFBF3F] transition-colors"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {categories.length > 0 && products.length > 0 && (
            <div className="mx-4 border-t border-zinc-800/60" />
          )}

          {/* Products */}
          {products.length > 0 && (
            <div className="px-4 pt-3 pb-2">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2 font-montserrat">
                Products
              </p>
              <div className="space-y-1">
                {products.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    onClick={onNavigate}
                    aria-label={`View product ${p.name ?? p.slug}`}
                    className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-zinc-800/60 transition-colors group"
                  >
                    {p.bannerImage ? (
                      <div className="w-10 h-10 rounded bg-zinc-900 overflow-hidden shrink-0">
                        <Image
                          src={getImageURL(p.bannerImage)}
                          alt={p.name ?? "Product"}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded bg-zinc-900 shrink-0 flex items-center justify-center text-zinc-700">
                        <IconShoppingBag size={16} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-300 group-hover:text-[#FFBF3F] transition-colors font-inter truncate">
                        {p.name ?? p.slug}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {p.basePrice != null && (
                          <span className="text-xs text-white font-semibold font-inter">
                            ₹{p.basePrice.toLocaleString("en-IN")}
                          </span>
                        )}
                        {p.strikethroughPrice != null && (
                          <span className="text-[11px] text-zinc-600 line-through font-inter">
                            ₹{p.strikethroughPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                    <IconArrowRight
                      size={14}
                      className="text-zinc-700 group-hover:text-[#FFBF3F] transition-colors shrink-0"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* View all link */}
          <Link
            href={`/products?q=${encodeURIComponent(query)}`}
            onClick={onNavigate}
            aria-label={`View all search results for ${query}`}
            className="flex items-center justify-center gap-1.5 py-3 border-t border-zinc-800/60 text-xs text-[#FFBF3F] font-semibold font-montserrat uppercase tracking-widest hover:bg-zinc-800/30 transition-colors"
          >
            View all results
            <IconArrowRight size={13} />
          </Link>
        </>
      )}
    </motion.div>
  );
}

// ─── Main Header ───────────────────────────────────────────────────
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const { wishlistSlugs } = useWishlist();
  const wishlistItems = wishlistSlugs.length;

  // Shared search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchProducts, setSearchProducts] = useState<SearchProduct[]>([]);
  const [searchCategories, setSearchCategories] = useState<SearchCategory[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const desktopWrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    let active = true;
    isUserLoggedIn()
      .then((loggedIn) => {
        if (active) setIsAuthenticated(loggedIn);
      })
      .catch(() => {
        if (active) setIsAuthenticated(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Debounced search fetch
  const performSearch = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query || query.trim().length < 2) {
      setSearchProducts([]);
      setSearchCategories([]);
      setIsSearching(false);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setSearchProducts(data.products ?? []);
        setSearchCategories(data.categories ?? []);
      } catch {
        setSearchProducts([]);
        setSearchCategories([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    performSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchProducts([]);
    setSearchCategories([]);
    setShowResults(false);
  };

  const handleResultNavigate = () => {
    clearSearch();
    setIsSearchOpen(false);
  };

  // Close desktop results on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        desktopWrapperRef.current &&
        !desktopWrapperRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMobileSearchToggle = () => {
    setIsSearchOpen((prev) => {
      if (!prev) {
        clearSearch();
        setTimeout(() => mobileInputRef.current?.focus(), 150);
      }
      return !prev;
    });
  };

  const navLinks = [
    // { name: "Home", href: "/" },
    // { name: "Products", href: "/products" },
    { name: "Shop", href: "/products" },
    { name: "Kitchen", href: "/kitchen" },
    { name: "Bathroom", href: "/bathroom" },
    // { name: "About", href: "/about" },
    { name: "Become a Dealer", href: "/dealer" },

    // { name: "Contact", href: "/contact" },
    { name: "Catalogue", href: "/catalogue" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <header className="bg-black text-white w-full border-b border-zinc-900 sticky top-0 z-50">
      <nav className="max-w-[1440px] mx-auto px-5 md:px-10 h-20 flex items-center justify-between">

        {/* -- MOBILE: Hamburger Menu (Left) -- */}
        <div className="lg:hidden flex-1">
          <button
            className="text-white hover:text-[#B88E2F] transition-colors"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <IconMenu2 size={26} stroke={1.5} />
          </button>
        </div>

        {/* -- Logo -- */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="cursor-pointer"
        >
          <Link href={"/"} aria-label="Go to Morzze homepage">
            <Image
              src={imageKitUrl("logo.png")}
              alt="Morzze Logo"
              width={150}
              height={50}
              priority
              className="w-[120px] h-auto md:w-[150px]"
            />
          </Link>
        </div>
        {/* <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="cursor-pointer"
        >
          <Image
            src={imageKitUrl("logo.png")}
            alt="Morzze Logo"
            width={150}
            height={50}
            priority
            className="w-[120px] md:w-[150px]"
          />
        </div> */}

        {/* -- WEB: Navigation Links -- */}
        <div className="hidden lg:flex items-center ml-15">
          <ul className="flex space-x-8 lg:space-x-7 text-[13px] font-medium font-montserrat tracking-wide text-white">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  aria-label={`Go to ${link.name}`}
                  className="hover:text-[#B88E2F] transition-all duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* -- RIGHT SECTION: Search & Icons -- */}
        <div className="flex items-center justify-end space-x-4 lg:space-x-6 flex-1">

          {/* WEB: Search Bar with Dropdown */}
          <div ref={desktopWrapperRef} className="relative hidden lg:block">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
              <IconSearch size={18} stroke={1.5} />
            </div>
            <input
              ref={desktopInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim().length >= 2) setShowResults(true);
              }}
              placeholder="Search Product"
              className="bg-[#141414] border border-zinc-800 text-[12px] font-inter rounded-md pl-10 pr-8 py-2 w-[200px] lg:w-[280px] focus:outline-none focus:border-[#B88E2F]/50 transition-all placeholder:text-zinc-600"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-2 flex items-center text-zinc-600 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <IconX size={14} />
              </button>
            )}

            {/* Desktop dropdown */}
            <AnimatePresence>
              {showResults && searchQuery.trim().length >= 2 && (
                <SearchResults
                  query={searchQuery}
                  products={searchProducts}
                  categories={searchCategories}
                  isLoading={isSearching}
                  onNavigate={handleResultNavigate}
                />
              )}
            </AnimatePresence>
          </div>

          {/* MOBILE: Search Icon Toggle */}
          <button
            className="lg:hidden text-white hover:text-[#B88E2F] transition-colors"
            onClick={handleMobileSearchToggle}
            aria-label="Toggle search"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isSearchOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <IconX size={24} stroke={1.5} />
                </motion.span>
              ) : (
                <motion.span
                  key="search"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <IconSearch size={24} stroke={1.5} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Icons Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden lg:block">
              <Link href={"/dashboard/wishlist"} aria-label="Go to Wishlist">
                <button className="hover:text-[#B88E2F] transition-colors flex items-center justify-center">
                  <IconHeart size={20} stroke={1.5} />
                </button>
              </Link>
              <span className="absolute -top-2 -right-2 bg-[#B88E2F] text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-black">
                {wishlistItems}
              </span>
            </div>


            {/* Cart with Badge */}
            <div className="relative">
              <Link href={"/cart"} aria-label="Go to Cart">
                <button className="text-white hover:text-[#B88E2F] transition-colors flex items-center justify-center">
                  <IconShoppingBag size={20} stroke={1.5} />
                </button>
              </Link>
              <span className="absolute -top-2 -right-2 bg-[#B88E2F] text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-black">
                {totalItems}
              </span>
            </div>
            {isAuthenticated ? (
              <Link href={"/dashboard/profile"} aria-label="Go to Profile">
                <button className="hover:text-[#B88E2F] transition-colors">
                  <IconUser size={20} stroke={1.5} />
                </button>
              </Link>
            ) : (
              <Link href={"/login"} aria-label="Go to Login">
                <button className="text-sm sm:px-3 py-2 sm:border border-zinc-700 rounded-md hover:border-[#B88E2F] hover:text-[#B88E2F] transition-colors">
                  <LogIn className="block sm:hidden " /> <p className=" hidden sm:block">Login</p>
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav >

      {/* -- MOBILE: Slide-down Search Bar with results -- */}
      <AnimatePresence>
        {
          isSearchOpen && (
            <motion.div
              key="mobile-search"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden border-b border-zinc-900 bg-black"
            >
              <div className="px-5 py-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
                    <IconSearch size={16} stroke={1.5} />
                  </div>
                  <input
                    ref={mobileInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search products…"
                    className="w-full bg-[#141414] border border-zinc-800 text-[13px] font-inter rounded-md pl-9 pr-10 py-2.5 focus:outline-none focus:border-[#B88E2F]/50 transition-all placeholder:text-zinc-600 text-white"
                  />
                  <button
                    onClick={() => {
                      clearSearch();
                      handleMobileSearchToggle();
                    }}
                    className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-[#B88E2F] transition-colors"
                    aria-label="Clear search"
                  >
                    <IconX size={16} stroke={1.5} />
                  </button>
                </div>

                {/* Mobile search results (inline, not dropdown) */}
                <AnimatePresence>
                  {searchQuery.trim().length >= 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-2 bg-[#111] border border-zinc-800 rounded-lg max-h-[60vh] overflow-y-auto custom-scrollbar"
                    >
                      {isSearching ? (
                        <div className="flex items-center justify-center py-6 gap-2 text-zinc-500 text-sm">
                          <IconLoader2 size={18} className="animate-spin" />
                          Searching…
                        </div>
                      ) : searchProducts.length === 0 && searchCategories.length === 0 ? (
                        <div className="py-6 text-center text-zinc-500 text-sm font-inter">
                          No results for &quot;{searchQuery}&quot;
                        </div>
                      ) : (
                        <>
                          {/* Categories */}
                          {searchCategories.length > 0 && (
                            <div className="px-3 pt-3 pb-1">
                              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2 font-montserrat">
                                Categories
                              </p>
                              {searchCategories.map((cat) => (
                                <Link
                                  key={cat.id}
                                  href={`/${cat.type || "kitchen"}/${cat.slug}`}
                                  onClick={handleResultNavigate}
                                  aria-label={`Go to ${cat.name} category`}
                                  className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-zinc-800/60 transition-colors group"
                                >
                                  {cat.bannerImage ? (
                                    <div className="w-8 h-8 rounded bg-zinc-900 overflow-hidden shrink-0">
                                      <Image
                                        src={getImageURL(cat.bannerImage)}
                                        alt={cat.name}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 rounded bg-zinc-900 shrink-0 flex items-center justify-center text-zinc-700 text-xs font-bold">
                                      {cat.name.charAt(0)}
                                    </div>
                                  )}
                                  <span className="text-sm text-zinc-300 group-hover:text-[#FFBF3F] transition-colors font-inter">
                                    {cat.name}
                                  </span>
                                  <IconArrowRight size={14} className="ml-auto text-zinc-700 group-hover:text-[#FFBF3F] transition-colors" />
                                </Link>
                              ))}
                            </div>
                          )}

                          {searchCategories.length > 0 && searchProducts.length > 0 && (
                            <div className="mx-3 border-t border-zinc-800/60" />
                          )}

                          {/* Products */}
                          {searchProducts.length > 0 && (
                            <div className="px-3 pt-3 pb-2">
                              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2 font-montserrat">
                                Products
                              </p>
                              {searchProducts.map((p) => (
                                <Link
                                  key={p.id}
                                  href={`/product/${p.slug}`}
                                  onClick={handleResultNavigate}
                                  aria-label={`View product ${p.name ?? p.slug}`}
                                  className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-zinc-800/60 transition-colors group"
                                >
                                  {p.bannerImage ? (
                                    <div className="w-10 h-10 rounded bg-zinc-900 overflow-hidden shrink-0">
                                      <Image
                                        src={getImageURL(p.bannerImage)}
                                        alt={p.name ?? "Product"}
                                        width={100}
                                        height={100}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded bg-zinc-900 shrink-0 flex items-center justify-center text-zinc-700">
                                      <IconShoppingBag size={16} />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-zinc-300 group-hover:text-[#FFBF3F] transition-colors font-inter truncate">
                                      {p.name ?? p.slug}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      {p.basePrice != null && (
                                        <span className="text-xs text-white font-semibold font-inter">
                                          ₹{p.basePrice.toLocaleString("en-IN")}
                                        </span>
                                      )}
                                      {p.strikethroughPrice != null && (
                                        <span className="text-[11px] text-zinc-600 line-through font-inter">
                                          ₹{p.strikethroughPrice.toLocaleString("en-IN")}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <IconArrowRight size={14} className="text-zinc-700 group-hover:text-[#FFBF3F] transition-colors shrink-0" />
                                </Link>
                              ))}
                            </div>
                          )}

                          {/* View all */}
                          <Link
                            href={`/products?q=${encodeURIComponent(searchQuery)}`}
                            onClick={handleResultNavigate}
                            aria-label={`View all search results for ${searchQuery}`}
                            className="flex items-center justify-center gap-1.5 py-3 border-t border-zinc-800/60 text-xs text-[#FFBF3F] font-semibold font-montserrat uppercase tracking-widest hover:bg-zinc-800/30 transition-colors"
                          >
                            View all results
                            <IconArrowRight size={13} />
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        }
      </AnimatePresence >

      {/* -- MOBILE: SIDEBAR OVERLAY -- */}
      <AnimatePresence>
        {
          isMenuOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-black z-[100] lg:hidden flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-900">
                <Image src={imageKitUrl("logo.png")} alt="Morzze" width={110} height={35} />
                <button onClick={() => setIsMenuOpen(false)} className="text-white" aria-label="Close menu">
                  <IconX size={28} />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <div className="flex flex-col p-8 space-y-8 font-montserrat">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      aria-label={`Go to ${link.name}`}
                      className="text-2xl font-light text-zinc-300 hover:text-[#B88E2F] flex justify-between items-center group"
                    >
                      {link.name}
                      <span className="h-[1px] w-0 bg-[#B88E2F] group-hover:w-10 transition-all duration-300"></span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Actions for Mobile */}
              <div className="mt-auto p-8 border-t border-zinc-900 bg-zinc-950 flex justify-around">
                <div className="relative">
                  <Link href="/dashboard/wishlist" onClick={() => setIsMenuOpen(false)} aria-label="Go to Wishlist">
                    <IconHeart size={24} className="text-zinc-400 hover:text-[#B88E2F] transition-colors" />
                  </Link>
                  <span className="absolute -top-2 -right-2 bg-[#B88E2F] text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-zinc-950">
                    {wishlistItems}
                  </span>
                </div>
                <Link href="/dashboard/profile" onClick={() => setIsMenuOpen(false)} aria-label="Go to Profile">
                  <IconUser size={24} className="text-zinc-400 hover:text-[#B88E2F] transition-colors" />
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setTimeout(() => handleMobileSearchToggle(), 300);
                  }}
                  aria-label="Open search"
                >
                  <IconSearch size={24} className="text-zinc-400 hover:text-[#B88E2F] transition-colors" />
                </button>
              </div>
            </motion.div>
          )
        }
      </AnimatePresence >
    </header >
  );
};

export default Header;
