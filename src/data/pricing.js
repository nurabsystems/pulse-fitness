// src/data/pricing.js
// Membership plans. Featured plan gets special styling.

export const pricingPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    featured: false,
    features: [
      "Access to group classes",
      "Locker room & showers",
      "Mobile app access",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 49,
    featured: true,
    features: [
      "Everything in Basic",
      "2 personal training sessions",
      "Nutrition consultation",
      "Priority class booking",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 79,
    featured: false,
    features: [
      "Everything in Standard",
      "Unlimited personal training",
      "Monthly body composition scan",
      "Guest passes (2/month)",
    ],
  },
];
