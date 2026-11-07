/**
 * Google Analytics Helper for Rahbars (GA4: G-B2Z633E4JY)
 */
export const GA_MEASUREMENT_ID = "G-B2Z633E4JY";

export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
};
