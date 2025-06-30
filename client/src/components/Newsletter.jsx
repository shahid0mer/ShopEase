import React from "react";

const Newsletter = () => {
  return (
    <div className="mt-[var(--space-4xl)] flex justify-center items-center">
      <div
        className="flex flex-col items-center justify-center bg-[linear-gradient(135deg,var(--primary)0%,var(--primary-dark)100%)] w-full h-auto min-h-[400px] md:h-[650px] text-center px-4 py-12 md:py-0
                  dark:bg-[linear-gradient(135deg,var(--primary-dark)0%,var(--neutral-900)100%)] dark:text-neutral-100"
      >
        <p className="text-[1.75rem] md:text-[2.25rem] lg:text-[2.5rem] font-montserrat font-extrabold items-center justify-center text-white px-4">
          Stay in the Loop – Get the Latest Deals & Drops!
        </p>
        <p className="mx-auto text-[1rem] md:text-[1.125rem] text-wrap mt-5 text-white max-w-2xl">
          Join thousands of savvy shoppers. Be the first to know about{" "}
          <span className="hidden md:inline">
            <br />
          </span>
          exclusive offers, new arrivals, and insider discounts.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-5 mt-[var(--space-2xl)] w-full px-4 max-w-4xl">
          <input
            type="email"
            placeholder="Enter Your Email"
            required
            className="
              bg-[var(--primary-light)] placeholder-[--neutral-700] w-full md:w-auto md:pr-40 pl-5 py-[var(--space-md)] rounded-[var(--space-lg)] border-2 border-[var(--neutral-200)] text-[1rem] focus:outline-none transition-all duration-400
              /* Dark mode specific styles */
              dark:bg-neutral-700 dark:placeholder-neutral-400 dark:border-neutral-600 dark:text-white
              /* Changed focus for dark mode */
              focus:border-[var(--secondary)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]
              dark:focus:border-[var(--secondary)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_0_0_3px_rgba(16,185,129,0.3)]
            "
          />
          <div className="w-full md:w-auto">
            <button className="hover:translate-y-[-2px] border-none rounded-[var(--radius-md)] bg-[var(--secondary)] text-white font-semibold py-[var(--space-md)] px-[var(--space-md)] hover:bg-[var(--secondary-dark)] hover:shadow-[var(--shadow-md)] duration-400 transition-all active:scale-95 w-full">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
