import { ChallengeAndSolution } from "@/components/dealer/challengeAndSolution";
import AnimatedCounterBar from "@/components/dealer/counterBar";
import FAQSection from "@/components/dealer/dealerFAQ";
import DealerApplicationForm from "@/components/dealer/dealerForm";
import DealerHero from "@/components/dealer/dealerHero";
import ContactCTASection from "@/components/dealer/dealerQuery";
// import MorzzePartnerSection from "@/components/dealer/partnerMorzze";
// import TerritoryCoverageSection from "@/components/dealer/territoryPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Join the Morzze Dealer Network for Kitchen & Bathroom sink`,
  description:
    "Partner with Morzze and become a part of our mission to deliver premium kitchen and bathroom solutions that combine innovation, quality, and sustainability.",
  alternates: {
    canonical: "/dealer",
  },
};

const page = () => {
  return (
    <div>
      <DealerHero />
      <AnimatedCounterBar />
      <ChallengeAndSolution />
      <AboutMorzze />
      <BrandFeatures />
      <ProductRange />
      <DealerBenefits />
      <BecomeDealer />
      {/* <MorzzePartnerSection /> */}
      {/* <TerritoryCoverageSection /> */}
      <DealerApplicationForm />
      <FAQSection />
      <ContactCTASection />
    </div>
  );
};

export default page;

const points = [
  "ISO Certified Manufacturing",
  "200+ Premium Product Variants",
  "Pan-India Distribution Network",
  "Comprehensive Warranty & Support",
];

export function AboutMorzze() {
  return (
    <section className="bg-[#111] px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="text-center">
          <h2 className="text-4xl font-bold md:text-6xl">
            About <span className="text-[#d2ad6b]">Morzze</span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-zinc-400 md:text-2xl">
            Delivering premium kitchen and bathroom solutions that blend
            impeccable design, innovation, and quality
          </p>
        </header>
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
          <img
            src="/img1.jpeg"
            alt="Morzze kitchen sink"
            className="h-[420px] w-full rounded-2xl object-cover md:h-[650px]"
          />
          <div>
            <h3 className="text-3xl font-bold md:text-4xl">
              Why Choose Morzze?
            </h3>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              With over 15 years of excellence in the industry, Morzze has
              established itself as a trusted name in premium kitchen and
              bathroom fixtures. Our in-house manufacturing ensures quality
              control, faster delivery, and competitive pricing for our
              distribution partners.
            </p>
            <ul className="mt-8 space-y-5">
              {points.map((x) => (
                <li key={x} className="flex gap-4 text-lg font-semibold">
                  <span className="text-[#d2ad6b]">●</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

import {
  ArrowRight,
  Factory,
  Medal,
  MoveRight,
  Shield,
  Sparkles,
} from "lucide-react";
const features = [
  {
    icon: Sparkles,
    title: "Minimalist Design",
    text: "Contemporary aesthetics that complement any interior",
  },
  {
    icon: Shield,
    title: "Unmatched Quality",
    text: "Premium materials and rigorous quality control",
  },
  {
    icon: Medal,
    title: "Premium Finishes",
    text: "Multiple color options and luxury aesthetic",
  },
  {
    icon: Factory,
    title: "In-house Manufacturing",
    text: "State-of-the-art facility ensuring consistent supply",
  },
];

export function BrandFeatures() {
  return (
    <section className="bg-[#111] px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="group rounded-2xl border border-zinc-800 bg-[#191919] p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#d2ad6b]/60 hover:shadow-[0_0_35px_rgba(210,173,107,.22)]"
            >
              <Icon className="mx-auto size-10 text-[#d2ad6b] transition-transform group-hover:scale-110" />
              <h3 className="mt-7 text-2xl font-bold">{title}</h3>
              <p className="mt-4 text-lg text-zinc-400">{text}</p>
            </article>
          ))}
        </div>
        <Link
          href="#dealer-form"
          className=" w-fit mx-auto mt-8  min-w-[190px] md:min-w-[220px] h-[48px] md:h-[52px] flex items-center justify-center group relative border border-[#CBA14D]/70 px-8 md:px-12 transition-all duration-300 bg-[#CBA14D] hover:bg-[#ab915e] overflow-hidden"
        >
          <span className="flex items-center relative z-10 font-inter text-[11px] md:text-xs font-bold text-black uppercase tracking-[0.22em]">
            Become an morzze dealer <MoveRight className="ml-2" size={16} />
          </span>
        </Link>
      </div>
    </section>
  );
}

const products = [
  {
    image: "/img2.jpeg",
    title: "Kitchen Sinks",
    text: "Premium stainless steel and granite sinks in various sizes and finishes",
    items: [
      "Multiple bowl configurations",
      "Scratch-resistant",
      "Premium finishes",
    ],
  },
  {
    image: "/img3.jpeg",
    title: "Kitchen & Bath Faucets",
    text: "Elegant faucets with superior finish and long-lasting performance",
    items: [
      "Air Tap technology",
      "Chrome & matte finishes",
      "Water-efficient designs",
    ],
  },
  {
    image: "/basin.jpeg",
    title: "Bathroom Basins",
    text: "Contemporary granite and ceramic basins for modern bathrooms",
    items: ["Designer styles", "Easy maintenance", "Durable materials"],
  },
];

const categories = [
  "Food Waste Disposers",
  "Towel Warmers",
  "Floor Drainers",
  "Kitchen Accessories",
  "Bathroom Accessories",
];

export function ProductRange() {
  return (
    <section className="bg-[#111] px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="text-center">
          <h2 className="text-4xl font-bold md:text-6xl">
            Our <span className="text-[#d2ad6b]">Product Range</span>
          </h2>
          <p className="mx-auto mt-5 max-w-4xl text-lg text-zinc-400 md:text-2xl">
            A comprehensive portfolio of premium kitchen and bathroom fixtures
            designed for modern living
          </p>
        </header>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {products.map((p) => (
            <article
              key={p.title}
              className="group overflow-hidden rounded-2xl border border-zinc-800 bg-[#191919] transition-all duration-300 hover:-translate-y-1 hover:border-[#d2ad6b]/60 hover:shadow-[0_0_38px_rgba(210,173,107,.22)]"
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  height={500}
                  width={500}
                  className="h-full w-full object-cover transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#191919] via-transparent to-transparent" />
              </div>
              <div className="p-7">
                <h3 className="text-2xl font-bold">{p.title}</h3>
                <p className="mt-4 text-lg text-zinc-400">{p.text}</p>
                <ul className="mt-5 space-y-3">
                  {p.items.map((x) => (
                    <li key={x} className="flex gap-3">
                      <span className="text-[#d2ad6b]">●</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-14 rounded-2xl border border-[#d2ad6b]/20 p-8 text-center">
          <h3 className="text-2xl font-bold">Additional Product Categories</h3>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {categories.map((x) => (
              <span
                key={x}
                className="rounded-full border border-[#d2ad6b]/20 bg-[#211e19] px-5 py-2 text-sm"
              >
                {x}
              </span>
            ))}
          </div>
          <a
            href="https://becomeadealer.morzze.com/catelogue.pdf"
            target="_blank"
            className="mt-8 inline-flex items-center gap-5 rounded-xl border border-[#d2ad6b]/30 px-8 py-3 font-semibold hover:bg-[#d2ad6b] hover:text-black"
          >
            Download Complete Catalogue <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

import {
  GraduationCap,
  MapPin,
  Megaphone,
  Truck,
  TrendingUp,
} from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "High Profit Margins",
    text: "Earn competitive margins on every sale with attractive pricing structures",
  },
  {
    icon: MapPin,
    title: "Exclusive Territory",
    text: "Protected distribution area to avoid market overlap and ensure growth",
  },
  {
    icon: Megaphone,
    title: "Marketing Support",
    text: "Banners, brochures, digital assets, and promotional campaign assistance",
  },
  {
    icon: GraduationCap,
    title: "Product Training",
    text: "Comprehensive onboarding and ongoing technical training programs",
  },
  {
    icon: Truck,
    title: "Reliable Supply Chain",
    text: "In-house manufacturing ensures faster lead times and consistent availability",
  },
  {
    icon: Shield,
    title: "Warranty & After-sales",
    text: "Backed by Morzze's comprehensive warranty and customer service support",
  },
];

export function DealerBenefits() {
  return (
    <section className="bg-[#111] px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="text-center">
          <h2 className="text-4xl font-bold md:text-6xl">
            Dealer <span className="text-[#d2ad6b]">Benefits</span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-xl text-zinc-400">
            Join our network and unlock a complete ecosystem of support designed
            for your success
          </p>
        </header>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="group rounded-2xl border border-zinc-800 bg-[#191919] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#d2ad6b]/60 hover:shadow-[0_0_36px_rgba(210,173,107,.22)]"
            >
              <span className="inline-grid size-16 place-items-center rounded-xl bg-[#29261f]">
                <Icon className="text-[#d2ad6b]" />
              </span>
              <h3 className="mt-6 text-2xl font-bold">{title}</h3>
              <p className="mt-3 text-lg leading-7 text-zinc-400">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-[#d4b477] to-[#dda83e] p-10 text-center text-[#161616]">
          <h3 className="text-3xl font-bold">Ready to Grow Your Business?</h3>
          <p className="mt-5 text-lg">
            Join 500+ successful dealers who trust Morzze for their premium
            product needs
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-8 font-bold">
            <span>↗ 30–40% Average Margins</span>
            <span>♢ 5-Year Warranty Support</span>
          </div>
        </div>
        <div className="mt-7 text-center">
          <a
            href="#dealer-form"
            className="inline-flex items-center gap-6 rounded-xl bg-[#d2ad6b] px-10 py-4 font-semibold text-black hover:bg-[#e2c181]"
          >
            Join as a Morzze Dealer <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}

import { FileText, UserRoundCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
const steps = [
  {
    icon: FileText,
    time: "Day 1",
    title: "Submit Application",
    text: "Fill out the dealer inquiry form with your business details and territory information",
  },
  {
    icon: UserRoundCheck,
    time: "Day 2–5",
    title: "Evaluation & Agreement",
    text: "Our team reviews your application and discusses partnership terms and conditions",
  },
  {
    icon: GraduationCap,
    time: "Week 2",
    title: "Onboarding & Training",
    text: "Comprehensive product training, marketing materials, and technical documentation provided",
  },
  {
    icon: Truck,
    time: "Week 3",
    title: "Product Delivery",
    text: "First inventory shipment with marketing collateral and point-of-sale materials",
  },
  {
    icon: TrendingUp,
    time: "Ongoing",
    title: "Ongoing Support",
    text: "Continuous assistance with marketing, sales, technical support, and business growth",
  },
];

const prereq = [
  "Registered business entity (proprietorship, partnership, or company)",
  "GST registration certificate",
  "Established distribution network or showroom space",
  "Financial capacity for initial inventory investment",
];

const terms = [
  "Minimum order quantity varies by product category",
  "Credit facility available for qualified dealers",
  "Flexible payment terms based on business relationship",
  "Exclusive territory rights subject to performance targets",
];

export function BecomeDealer() {
  return (
    <section className="bg-[#111] px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="text-center">
          <h2 className="text-4xl font-bold md:text-5xl">
            How to <span className="text-[#d2ad6b]">Become a Dealer</span>
          </h2>
          <p className="mt-5 text-xl text-zinc-400">
            A simple, transparent process to get you started in just a few weeks
          </p>
        </header>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map(({ icon: Icon, time, title, text }, i) => (
            <article
              key={title}
              className="group relative rounded-2xl border border-zinc-800 bg-[#191919] p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#d2ad6b]/60 hover:shadow-[0_0_36px_rgba(210,173,107,.22)]"
            >
              <span className="absolute right-5 top-4 text-6xl font-bold text-[#d2ad6b]/5">
                {i + 1}
              </span>
              <span className="mx-auto grid size-16 place-items-center rounded-full border-2 border-[#d2ad6b] bg-[#29261f]">
                <Icon className="text-[#d2ad6b]" />
              </span>
              <span className="mt-6 inline-block rounded-full bg-[#29261f] px-4 py-1 text-sm font-bold text-[#d2ad6b]">
                {time}
              </span>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-3 leading-6 text-zinc-400">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-16 rounded-2xl border border-[#d2ad6b]/20 p-9">
          <h3 className="text-center text-3xl font-bold">
            Common Requirements
          </h3>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            <Requirement title="Business Prerequisites" items={prereq} />
            <Requirement title="Partnership Terms" items={terms} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Requirement({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-xl font-bold text-[#d2ad6b]">{title}</h4>
      <ul className="mt-5 space-y-4 text-zinc-400">
        {items.map((x) => (
          <li key={x} className="flex gap-3">
            <span className="text-[#d2ad6b]">●</span>
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}
