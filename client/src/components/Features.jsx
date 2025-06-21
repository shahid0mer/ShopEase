import React from "react";

const Features = () => {
  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-[300px] pt-16 md:pt-32 lg:pt-[200px]">
      <div className="mb-12 md:mb-[100px]">
        <p className="text-[1.75rem] sm:text-[2rem] md:text-[2.25rem] lg:text-[2.5rem] font-montserrat font-extrabold text-center text-[var(--neutral-800)] tracking-tight mb-[var(--space-lg)]">
          Why Shop With Us?
        </p>
        <p className="text-center text-[var(--neutral-500)] text-[1rem] sm:text-[1.125rem] mx-auto max-w-2xl">
          Experience the difference with our commitment to quality, convenience,
          and customer satisfaction.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-xl)] md:gap-[var(--space-2xl)] place-items-center">
        {[
          {
            icon: (
              <svg
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-[var(--primary)] group-hover:stroke-white transition-colors"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            ),
            title: "Unbeatable Quality",
            description:
              "Every product is handpicked and rigorously tested to ensure the highest standards.",
          },
          {
            icon: (
              <svg
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-[var(--primary)] group-hover:stroke-white transition-colors"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            ),
            title: "Fast & Reliable Shipping",
            description:
              "Get your favorite items delivered quickly and safely right to your doorstep.",
          },
          {
            icon: (
              <svg
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-[var(--primary)] group-hover:stroke-white transition-colors"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
            ),
            title: "24/7 Customer Support",
            description:
              "Our dedicated team is always ready to assist you with any questions or concerns.",
          },
          {
            icon: (
              <svg
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-[var(--primary)] group-hover:stroke-white transition-colors"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            ),
            title: "Secure & Easy Payments",
            description:
              "Shop with confidence using our encrypted and hassle-free payment gateways.",
          },
          {
            icon: (
              <svg
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-[var(--primary)] group-hover:stroke-white transition-colors"
              >
                <path d="M14 19l-7-7 7-7"></path>
                <path d="M14 19l-7-7 7-7"></path>
              </svg>
            ),
            title: "Hassle-Free Returns",
            description:
              "Not satisfied? Our straightforward return policy makes exchanges easy.",
          },
          {
            icon: (
              <svg
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-[var(--primary)] group-hover:stroke-white transition-colors"
              >
                <path d="M17 19.22H5V7.99a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10.23"></path>
                <circle cx="7" cy="4" r="2"></circle>
                <circle cx="17" cy="4" r="2"></circle>
              </svg>
            ),
            title: "Eco-Conscious Packaging",
            description:
              "We use sustainable materials to minimize our environmental footprint.",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="w-full min-h-[250px] md:min-h-[300px] bg-white flex flex-col justify-center items-center gap-8 md:gap-12 p-6 md:p-[var(--space-2xl)] rounded-[var(--radius-xl)] border border-[var(--neutral-200)] shadow-[var(--shadow-sm)] hover:border-[var(--primary-dark)] hover:translate-y-[-5px] hover:shadow-[var(--shadow-lg)] transition-all group duration-300"
          >
            <div className="rounded-[50%] bg-[var(--primary-light)] p-4 md:p-5 group-hover:bg-[var(--primary)] transition-colors">
              {feature.icon}
            </div>
            <div className="flex flex-col justify-center items-center">
              <h3 className="text-center font-bold text-[1.125rem] md:text-[1.25rem] text-[var(--neutral-800)]">
                {feature.title}
              </h3>
              <p className="mt-4 md:mt-7 text-center text-[0.875rem] md:text-[1rem] text-[var(--neutral-500)]">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
