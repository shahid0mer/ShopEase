// src/utils/toast.js
import { toast } from "sonner";
import React from "react";

// Define your Shop Ease brand colors using the CSS custom properties
// Since we can't directly use CSS variables in JS for style objects,
// we'll copy their hex values here.
const ShopEaseColors = {
  primary: "#10b981", // --primary
  primaryDark: "#0d9488", // --primary-dark
  primaryLight: "#d1fae5", // --primary-light

  secondary: "#d97706", // --secondary
  secondaryDark: "#b45309", // --secondary-dark
  secondaryLight: "#fef3c7", // --secondary-light

  neutral50: "#f8fafc", // --neutral-50 (Nearly white)
  neutral200: "#e2e8f0", // --neutral-200 (Very light gray)
  neutral500: "#64748b", // --neutral-500 (Medium gray)
  neutral700: "#334155", // --neutral-700 (Medium gray)
  neutral800: "#1e293b", // --neutral-800 (Soft dark gray)

  // Standard colors for error/info if not explicitly defined in your vars
  dangerRed: "#dc3545", // A common red
  infoBlue: "#0d6efd", // A common blue
};

// --- Custom Icons (as defined previously) ---
// You can use SVG inline or import them as React components
const CheckCircleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="20px"
    height="20px"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </svg>
);

const XCircleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="20px"
    height="20px"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.73 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.73a.75.75 0 1 0 1.06-1.06L13.06 12l1.73-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.73Z"
      clipRule="evenodd"
    />
  </svg>
);

const InfoIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="20px"
    height="20px"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
      clipRule="evenodd"
    />
  </svg>
);

const ExclamationTriangleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="20px"
    height="20px"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M9.401 3.003c1.155-2.003 4.32-.235 4.32 0l2.574 4.457A9.228 9.228 0 0 1 21.75 12c0 1.277-.32 2.51-.92 3.61l-.92 1.597a10.025 10.025 0 0 1-4.722 5.087l-1.05 1.05c-.412.412-1.121.362-1.464-.1l-1.05-1.05a10.025 10.025 0 0 1-4.722-5.087l-.92-1.597A9.228 9.228 0 0 1 2.25 12c0-1.277.32-2.51.92-3.61L5.75 3.003Zm.877 7.045a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0V10.048Zm.5-7.5a.75.75 0 0 0-.75.75v.75a.75.75 0 0 0 1.5 0V3.298a.75.75 0 0 0-.75-.75Z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Shop Ease Toast Function ---
export const shopEaseToast = {
  success: (message, options) => {
    toast.success(message, {
      duration: 3000,
      icon: <CheckCircleIcon style={{ color: ShopEaseColors.primary }} />, // Use --primary
      style: {
        backgroundColor: ShopEaseColors.primaryLight, // Use --neutral-50 for background
        borderColor: ShopEaseColors.primary, // Use --primary for border
        color: ShopEaseColors.neutral800, // Use --neutral-800 for text
        boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
        padding: "13px 1px 13px 1px",
      },
      classNames: {
        title: "text-center ",
        description: "text-center ",
        toast: "flex items-center justify-center", //this is the main div
      },
      ...options,
    });
  },

  error: (message, options) => {
    toast.error(message, {
      duration: 1500,
      icon: <XCircleIcon style={{ color: ShopEaseColors.dangerRed }} />, // Standard red for error icon
      style: {
        backgroundColor: ShopEaseColors.primaryLight,
        borderColor: ShopEaseColors.dangerRed, // Standard red for error border
        color: ShopEaseColors.neutral800,
        boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
        padding: "13px 1px 13px 1px",
      },
      classNames: {
        title: "text-center ",
        description: "text-center ",
        toast: "flex items-center justify-center font-montserrat", //this is the main div
      },
      ...options,
    });
  },

  info: (message, options) => {
    toast.info(message, {
      duration: 3500,
      icon: <InfoIcon style={{ color: ShopEaseColors.infoBlue }} />, // Standard blue for info icon
      style: {
        backgroundColor: ShopEaseColors.neutral50,
        borderColor: ShopEaseColors.infoBlue, // Standard blue for info border
        color: ShopEaseColors.neutral800,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      },
      ...options,
    });
  },

  warning: (message, options) => {
    toast.warning(message, {
      duration: 4000,
      icon: (
        <ExclamationTriangleIcon style={{ color: ShopEaseColors.secondary }} />
      ), // Use --secondary for warning icon
      style: {
        backgroundColor: ShopEaseColors.neutral50,
        borderColor: ShopEaseColors.secondary, // Use --secondary for warning border
        color: ShopEaseColors.neutral800,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      },
      ...options,
    });
  },

  // Custom toast type for "Sign In Prompt"
  signInPrompt: (message = "Please sign in to continue.", options) => {
    toast(message, {
      // Using the generic toast for custom content
      duration: 5000,
      icon: <InfoIcon style={{ color: ShopEaseColors.infoBlue }} />, // Info icon as it's a prompt
      style: {
        backgroundColor: ShopEaseColors.neutral50,
        borderColor: ShopEaseColors.infoBlue, // Border for prompt
        color: ShopEaseColors.neutral800,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      },
      // The action button styling usually comes from Sonner's internal defaults,
      // but you can influence it with global CSS or richColors if needed.
      action: {
        label: "Sign In",
        onClick: () => {
          console.log("Navigate to sign-in page");
          // This onClick will be provided in the component that calls it
        },
      },
      ...options, // Allows overriding default message or action
    });
  },
};
