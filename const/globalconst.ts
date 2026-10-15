export const pageSize = 20;
export const cacheRevalidateTime = 86400;
export const canResendOTPInterval = 10; // in seconds
export const isUUID = (identifier: string) =>
  /^[0-9a-fA-F-]{36}$/.test(identifier);

export const tempUserId = "63089f34-5276-481f-bc92-f75ff1ad24a5";
export const bestSellingSlug = "best-selling-products";
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const kitchenBathroomRestrictCategories = new Set([
  "Hand-Shower",
  "trending-now",
  "Aura",
  "Sink-Drainer-Adapter",
  "signature-pieces",
  "Drain-Pipe",
  "Liquid-Soap-Dispenser",
  "Sink-Strainer-Cover",
  "new-arrivals",
  "Sink-Strainer",
  // "Kitchen-Accessories"
]);

export const allowedCategoryNames = new Set([
  "air-tap",
  "Air-Tap",
  "Granite-Sinks",
  "Steel-Sinks",
  "Kitchen-Faucets",
  "Bathroom-Faucets",
  "Bathroom-Basins",
  "Towel-Warmers",
  "Food-Waste-Disposers",
  "Floor-Drainers",
]);
