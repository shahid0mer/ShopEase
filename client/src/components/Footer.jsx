import React from "react";

const Footer = () => {
  return (
    <div className="flex flex-col">
      {/* Main footer container with linear gradient background */}
      <div className="flex flex-col w-full bg-[linear-gradient(45deg,var(--primary-dark)0%,var(--primary)100%)] px-7 md:px-12 lg:px-[var(--space-2xl)] pt-8  shadow-md">
        {/* Top content of the footer (logo, quick links, contact info) */}
        <div className="flex flex-col md:flex-row justify-between pb-8">
          {" "}
          {/* Added pb-8 for spacing before copyright */}
          {/* Logo and About Us section */}
          <div className="w-full md:w-[300px] mb-8 md:mb-0">
            <div className="logo group flex items-center gap-2 transition-transform duration-300 ease-in-out hover:-translate-y-0.5 mb-4">
              <svg
                width={28}
                height={28}
                viewBox="0 0 28 28"
                fill="none"
                className="shrink-0 transition-transform duration-300 ease-in-out group-hover:rotate-[-5deg] group-hover:scale-105 items-center"
              >
                {/* Bag Body */}
                <path
                  d="M6 4L3 8V22C3 22.5304 3.21071 23.0391 3.58579 23.4142C3.96086 23.7893 4.46957 24 5 24H23C23.5304 24 24.0391 23.7893 24.4142 23.4142C24.7893 23.0391 25 22.5304 25 22V8L22 4H6Z"
                  fill="#F8FAFC"
                  stroke="#10B981"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 8H25"
                  stroke="#10B981"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M10 12C10 14.2091 11.7909 16 14 16C16.2091 16 18 14.2091 18 12"
                  stroke="url(#footerHandleGradient)"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="footerHandleGradient"
                    x1={10}
                    y1={12}
                    x2={18}
                    y2={12}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#10B981" />{" "}
                    <stop offset="100%" stopColor="#D97706" />{" "}
                  </linearGradient>
                </defs>
              </svg>

              <span className="font-montserrat font-bold text-black text-[1.8rem] tracking-tight">
                Shop<span className="text-[#d97706] tracking-tight">Ease</span>
              </span>
            </div>
            <div>
              <p className="text-[hsla(0,0%,100%,0.8)] font-inter text-[0.95rem] leading-relaxed">
                Your ultimate destination for quality products and exceptional
                service. Shop smart, live easy.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between w-full md:w-[calc(100%-340px)] lg:w-[1000px] gap-8 md:gap-4 lg:gap-12">
            <div className="flex-1">
              <h3 className="text-white font-montserrat font-bold text-[1.25rem] mb-4 relative pb-1 after:content-[''] after:block after:w-12 after:h-0.5 after:bg-[var(--secondary)] after:rounded-sm after:absolute after:bottom-0 after:left-0">
                Quick Links
              </h3>
              <div className="text-[0.95rem] flex flex-col font-inter font-light gap-3 text-[hsla(0,0%,100%,0.8)]">
                <a className="hover:underline hover:text-white" href="#">
                  About Us
                </a>
                <a className="hover:underline hover:text-white" href="#">
                  Contact Us
                </a>
                <a className="hover:underline hover:text-white" href="#">
                  Blog
                </a>
                <a className="hover:underline hover:text-white" href="#">
                  Sitemap
                </a>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-white font-montserrat font-bold text-[1.25rem] mb-4 relative pb-1 after:content-[''] after:block after:w-12 after:h-0.5 after:bg-[var(--secondary)] after:rounded-sm after:absolute after:bottom-0 after:left-0">
                Customer Service
              </h3>
              <div className="text-[0.95rem] flex flex-col font-inter font-light gap-3 text-[hsla(0,0%,100%,0.8)]">
                <a className="hover:underline hover:text-white" href="#">
                  FAQ
                </a>
                <a className="hover:underline hover:text-white" href="#">
                  Shipping Information
                </a>
                <a className="hover:underline hover:text-white" href="#">
                  Return Policy
                </a>
                <a className="hover:underline hover:text-white" href="#">
                  Order Tracking
                </a>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-white font-montserrat font-bold text-[1.25rem] mb-4 relative pb-1 after:content-[''] after:block after:w-12 after:h-0.5 after:bg-[var(--secondary)] after:rounded-sm after:absolute after:bottom-0 after:left-0">
                Connect With Us
              </h3>
              <div className="flex gap-3 mb-4">
                <a
                  className="inline-flex items-center justify-center bg-[rgba(255,255,255,0.15)] p-2 rounded-full w-10 h-10 transition-all duration-200 hover:bg-[var(--secondary)] hover:-translate-y-0.5 hover:scale-105"
                  href="#"
                  aria-label="Facebook"
                >
                  <img
                    src="https://img.icons8.com/ios-filled/24/ffffff/facebook-new.png"
                    alt="Facebook"
                    className="w-5 h-5 filter invert"
                  />
                </a>
                <a
                  className="inline-flex items-center justify-center bg-[rgba(255,255,255,0.15)] p-2 rounded-full w-10 h-10 transition-all duration-200 hover:bg-[var(--secondary)] hover:-translate-y-0.5 hover:scale-105"
                  href="#"
                  aria-label="Twitter"
                >
                  <img
                    src="https://img.icons8.com/ios-filled/24/ffffff/twitterx--v2.png"
                    alt="Twitter"
                    className="w-5 h-5 filter invert"
                  />
                </a>
                <a
                  className="inline-flex items-center justify-center bg-[rgba(255,255,255,0.15)] p-2 rounded-full w-10 h-10 transition-all duration-200 hover:bg-[var(--secondary)] hover:-translate-y-0.5 hover:scale-105"
                  href="#"
                  aria-label="Instagram"
                >
                  <img
                    src="https://img.icons8.com/ios-filled/24/ffffff/instagram-new--v1.png"
                    alt="Instagram"
                    className="w-5 h-5 filter invert"
                  />
                </a>
                <a
                  className="inline-flex items-center justify-center bg-[rgba(255,255,255,0.15)] p-2 rounded-full w-10 h-10 transition-all duration-200 hover:bg-[var(--secondary)] hover:-translate-y-0.5 hover:scale-105"
                  href="#"
                  aria-label="LinkedIn"
                >
                  <img
                    src="https://img.icons8.com/ios-filled/24/ffffff/linkedin.png"
                    alt="LinkedIn"
                    className="w-5 h-5 filter invert"
                  />
                </a>
              </div>

              <div className="text-[0.95rem] flex flex-col font-inter font-light gap-3 text-[hsla(0,0%,100%,0.8)]">
                <a
                  className="hover:underline hover:text-white"
                  href="mailto:support@shopease.com"
                >
                  Email: support@shopease.com
                </a>
                <a
                  className="hover:underline hover:text-white"
                  href="tel:+1234567890"
                >
                  Phone: +1 (234) 567-890
                </a>
              </div>
            </div>
          </div>
        </div>

        
        <div className="w-full text-white text-[0.9rem] text-center py-4 border-t border-[rgba(255,255,255,0.1)] flex flex-col md:flex-row items-center justify-center md:justify-between px-0">
          {" "}
          
          <p className="mb-2 md:mb-0 text-[hsla(0,0%,100%,0.7)]">
            &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
          </p>
          <div className="flex gap-3 mt-2 md:mt-0">
            
            <img
              src="https://img.icons8.com/fluency/32/visa.png"
              alt="Visa"
              className="h-7 opacity-80 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://img.icons8.com/fluency/32/mastercard.png"
              alt="Mastercard"
              className="h-7 opacity-80 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://img.icons8.com/fluency/32/paypal.png"
              alt="PayPal"
              className="h-7 opacity-80 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://img.icons8.com/?size=100&id=13607&format=png&color=000000"
              alt="American Express"
              className="h-7 opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
