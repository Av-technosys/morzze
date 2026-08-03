import Image from "next/image";
import Link from "@/hooks/appLink";
import {
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandYoutube,
  IconBrandLinkedin,
  IconBrandPinterest,
  IconBrandX,
} from "@tabler/icons-react";
import { imageKitUrl } from "@/lib/imagekit-url";
const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Coupons", href: "/promo-code" },
  { name: "Videos", href: "/videos" },
  { name: "Catalogue", href: "/catalogue" },
  { name: "Media", href: "/media" },
  { name: "Careers", href: "/career" },
  { name: "Blogs", href: "/blog" },
  { name: "Products", href: "/products" },
];

const Footer = async () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative  w-full text-white overflow-hidden font-inter">
      {/* Background Section */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageKitUrl("footer-bg.png")}
          alt="Footer Background"
          height={1080}
          width={1920}
          sizes="100vw"
          className="object-cover w-full h-full object-center opacity-100"
          priority
        />
        <div className="absolute inset-0 bg-black/40 md:bg-black/20"></div>
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-10 py-12 md:py-16">
        {/* Main Grid: Mobile par vertical stack, Web par grid */}
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {/* Logo & Description Section */}
          <div className="text-left">
            <Link
              href="/"
              aria-label="Go to Morzze homepage"
              className="inline-block cursor-pointer"
            >
              <div className="relative w-40 h-16 md:w-48 md:h-20">
                <Image
                  src={imageKitUrl("anupam_logo-removebg-preview.png")}
                  alt="Morzze Logo"
                  height={500}
                  width={500}
                  sizes="(max-width: 768px) 160px, 192px"
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            <p className="text-sm md:text-[13px] text-white/90 font-inter leading-relaxed max-w-sm">
              Premium kitchen & bathroom fittings crafted with European design
              sensibility and Indian craftsmanship.
            </p>

            {/* Social Icons Stacked like Mobile Screenshot */}
            <div className=" mt-4 flex items-center space-x-5 pt-2">
              <a
                href="http://instagram.com/morzzeindia/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Instagram page"
              >
                <IconBrandInstagram
                  size={22}
                  stroke={1.5}
                  className="text-white/90 hover:text-[#CBA14D] cursor-pointer transition-colors"
                />
              </a>
              <a
                href="https://in.pinterest.com/morzzeindia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Pinterest page"
              >
                <IconBrandPinterest
                  size={22}
                  stroke={1.5}
                  className="text-white/90 hover:text-[#CBA14D] cursor-pointer transition-colors"
                />
              </a>
              <a
                href="https://x.com/Morzzeindia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our X (Twitter) page"
              >
                <IconBrandX
                  size={22}
                  stroke={1.5}
                  className="text-white/90 hover:text-[#CBA14D] cursor-pointer transition-colors"
                />
              </a>

              <a
                href="https://www.facebook.com/Morzzeindia/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Facebook page"
              >
                <IconBrandFacebook
                  size={22}
                  stroke={1.5}
                  className="text-white/90 hover:text-[#CBA14D] cursor-pointer transition-colors"
                />
              </a>

              <a
                href="https://www.youtube.com/@MorzzeIndia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our YouTube channel"
              >
                <IconBrandYoutube
                  size={22}
                  stroke={1.5}
                  className="text-white/90 hover:text-[#CBA14D] cursor-pointer transition-colors"
                />
              </a>

              <a
                href="https://www.linkedin.com/company/morzzeindia/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our LinkedIn page"
              >
                <IconBrandLinkedin
                  size={22}
                  stroke={1.5}
                  className="text-white/90 hover:text-[#CBA14D] cursor-pointer transition-colors"
                />
              </a>
            </div>
          </div>

          {/* Links Sections: Mobile par 2 columns mein split */}
          <div className="grid grid-cols-2 gap-8 md:contents">
            {/* Shop Section */}
            <div className="text-left">
              <span className="font-montserrat text-sm font-bold text-white uppercase tracking-[0.15em] mb-6 border-b border-white/10 pb-2 md:border-none">
                Shop
              </span>

              <ul className="space-y-3 mt-3">
                {[
                  {
                    label: "Stainless Steel Sinks",
                    href: "/kitchen/stainless-steel-sinks",
                  },
                  {
                    label: "Wash Basins",
                    href: "/bathroom/Bathroom-Basins",
                  },
                  {
                    label: "Air Taps",
                    href: "/kitchen/Air-Tap",
                  },
                  {
                    label: "Floor Drainers",
                    href: "/bathroom/Floor-Drainers",
                  },
                  {
                    label: "Towel Warmers",
                    href: "/bathroom/Towel-Warmers",
                  },
                  {
                    label: "Bathroom Faucets",
                    href: "/bathroom/Bathroom-Faucets",
                  },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      aria-label={`Go to ${item.label}`}
                      className="text-sm text-white/70 hover:text-[#CBA14D] font-inter transition-colors block"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Section */}
            <div className="text-left">
              <span className="font-montserrat text-sm font-bold text-white uppercase tracking-[0.15em] mb-6 border-b border-white/10 pb-2 md:border-none">
                Company
              </span>

              <ul className="space-y-3 mt-3">
                {companyLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      aria-label={`Go to ${item.name}`}
                      className="text-sm text-white/70 hover:text-[#CBA14D] font-inter transition-colors block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Support Section */}
          <div className="text-left">
            <span className="font-montserrat text-sm font-bold text-white uppercase tracking-[0.15em] mb-6 border-b border-white/10 pb-2 md:border-none">
              Support
            </span>

            <ul className="space-y-3 mt-3">
              {[
                { name: "Contact Us", link: "/contact" },
                { name: "Warranty", link: "/warranty" },
                { name: "Become a Dealer", link: "/dealer" },
                { name: "Find a Store", link: "/stores" },
                // { name: "Returns & Exchange", link: "/return-exchange" },
                { name: "Support", link: "/support" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    aria-label={`Go to ${item.name}`}
                    className="text-sm text-white/70 hover:text-[#CBA14D] font-inter transition-colors block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Mobile Optimized Layout */}
      <div className="relative z-10 border-t border-white/40 w-full bg-black/60 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-14 py-8 flex flex-col items-center space-y-6 md:flex-row md:justify-between md:space-y-0">
          <p className="text-[11px] text-white/60 font-inter tracking-wide order-3 md:order-1">
            © {currentYear} Morzze. All Rights Reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[11px] font-inter order-1 md:order-2">
            <Link
              href="/privacy-policy"
              target="_blank"
              aria-label="Read our Privacy Policy"
              className="text-white/80 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms-of-use"
              target="_blank"
              aria-label="Read our Terms of Service"
              className="text-white/80 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>

            {/* <Link
              href="return-exchange"
              target="_blank"
              className="text-white/80 hover:text-white transition-colors"
            >
              Refund
            </Link> */}

            <Link
              href="/return-exchange"
              target="_blank"
              aria-label="Read our Return Policy"
              className="text-white/80 hover:text-white transition-colors"
            >
              Return Policy
            </Link>
          </div>

          <p className="text-[11px] text-white/60 font-inter text-center md:text-right order-2 md:order-3 max-w-[200px] md:max-w-none">
            A-42, Phase-1, Naraina Industrial Area, New Delhi, 110028
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
