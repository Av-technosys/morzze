export const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.morzze.com/#organization",
      "name": "Morzze",
      "url": "https://www.morzze.com/",
      "brand": "Morzze",
      "email": "info@morzze.com",
      "foundingDate": "1990",
      "knowsLanguage": ["en", "en-UK"],
      "knowsabout": [
        "Morzze",
        "granite sink",
        "granite kitchen sinks",
        "sink kitchen granite",
        "kitchen sink with granite",
        "Bathroom Sinks Manufacturer",
        "kitchen air tap",
        "food waste disposers",
        "black kitchen sink granite",
        "food disposer",
        "towel warmer",
        "best stainless steel kitchen sink",
        "double sink size",
        "food waste disposer",
        "granite wash basin",
        "kitchen faucets",
        "stainless kitchen sinks",
        "sink steel stainless",
        "stainless steel sink",
        "kitchen Sinks Manufacturer",
        "stainless steel kitchen sink",
        "kitchen tap faucet",
        "kitchen sink faucets",
        "bathroom wash basin",
        "handheld shower",
        "hand shower for bathroom",
        "kitchen sink strainer",
        "stainless steel sink strainer",
        "liquid soap dispenser",
        "food waste disposal",
        "kitchen waste disposal",
        "Floor Drainers",
        "stainless steel floor drain",
        "bathroom floor drain",
        "towel warmer for bathroom",
        "electric towel warmer",
        "wall mounted towel warmer",
        "electric towel warmer wall mounted",
        "best wall mounted towel warmer",
        "bathroom faucets",
        "bathroom sink faucets",
        "best bathroom faucets",
        "bathroom shower faucets",
        "modern bathroom faucets",
        "floor drainer",
        "shower channel drain",
        "shower channel",
        "shower drain",
        "sink manufacturers in india",
        "food waste dispenser",
        "air taps",
        "granite kitchen basin",
      ],
      "numberOfEmployees": "200",
      "sameAs": [
        "https://www.facebook.com/Morzzeindia/",
        "https://www.instagram.com/Morzzeindia/",
        "https://www.linkedin.com/company/morzzeindia/",
        "https://www.youtube.com/@morzzeindia",
        "https://in.pinterest.com/morzzeindia",
        "https://x.com/Morzzeindia",
        "https://linktr.ee/Morzze",
      ],
      "award": [
        "Best Bathroom Sinks Manufacturer in Delhi",
        "Best Kitchen Sinks Manufacturer in India",
      ],
      "logo": {
        "@type": "ImageObject",
        "@id": "https://www.morzze.com/#logo",
        "inLanguage": "en-UK",
        "image": "https://d2icu6klh68l1z.cloudfront.net/logo.png",
        "url": "https://d2icu6klh68l1z.cloudfront.net/logo.png",
        "width": 725,
        "height": 224,
        "caption": "Morzze",
        "description":
          "Morzze offers a diverse range of high-quality kitchen and bathroom sinks. Our range of stylish and functional sinks is designed to complement any decor. Explore our collection today and transform your space.",
      },
      "legalName": "Morzze",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.morzze.com/#organization",
      "url": "https://www.morzze.com/",
      "name": "Morzze",
      "description":
        "Morzze offers a diverse range of high-quality kitchen and bathroom sinks. Our range of stylish and functional sinks is designed to complement any decor. Explore our collection today and transform your space.",
      "publisher": {
        "@id": "https://www.morzze.com/#organization",
      },
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": "https://www.morzze.com/?s={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      ],
      "inLanguage": "en-UK",
    },
    {
      "@type": ["Person"],
      "@id": "https://www.morzze.com/#Person",
      "name": "Rajender Garg",
      "description":
        "At Morzze, we blend innovation with craftsmanship to create high-quality kitchen and bathroom fittings. Our focus is on elevating your interiors with durable, stylish solutions designed for everyday use.",
    },
  ],
};

export const kitchenLandingSchema = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.morzze.com/",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Kitchen",
        "item": "https://www.morzze.com/kitchen",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Our Kitchen Categories",
    "description":
      "Explore our diverse range of high-quality kitchen products including sinks, faucets, air taps, and food waste disposers.",
    "url": "https://www.morzze.com/kitchen",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Stainless Steel Sinks",
          "url": "https://www.morzze.com/kitchen/stainless-steel-sinks",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Pulse Steel Sinks",
          "url": "https://www.morzze.com/kitchen/pulse",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Granite Sink",
          "url": "https://www.morzze.com/kitchen/Granite-Sinks",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Kitchen Accessories",
          "url": "https://www.morzze.com/kitchen/Kitchen-Accessories",
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "Vertex Granite Sink",
          "url": "https://www.morzze.com/kitchen/Vertex",
        },
        {
          "@type": "ListItem",
          "position": 6,
          "name": "Air Tap",
          "url": "https://www.morzze.com/kitchen/Air-Tap",
        },
        {
          "@type": "ListItem",
          "position": 7,
          "name": "Food Waste Disposers",
          "url": "https://www.morzze.com/kitchen/Food-Waste-Disposers",
        },
        {
          "@type": "ListItem",
          "position": 8,
          "name": "Neo Steel Sink",
          "url": "https://www.morzze.com/kitchen/neo",
        },
        {
          "@type": "ListItem",
          "position": 9,
          "name": "Kitchen Faucet",
          "url": "https://www.morzze.com/kitchen/Kitchen-Faucets",
        },
        {
          "@type": "ListItem",
          "position": 10,
          "name": "Edge Steel Sinks",
          "url": "https://www.morzze.com/kitchen/edge-steel-sinks",
        },
      ],
    },
  },
];

export const bathroomLandingSchema = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.morzze.com/",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Bathroom",
        "item": "https://www.morzze.com/bathroom",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Our Bathroom Categories",
    "description":
      "Explore premium bathroom accessories by Morzze, including faucets, wash basins, towel warmers, and floor drainers designed for style, durability, and functionality.",
    "url": "https://www.morzze.com/bathroom",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Bathroom Faucets",
          "url": "https://www.morzze.com/bathroom/Bathroom-Faucets",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Wash Basins",
          "url": "https://www.morzze.com/bathroom/Bathroom-Basins",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Floor Drainer",
          "url": "https://www.morzze.com/bathroom/Floor-Drainers",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Towel Warmer",
          "url": "https://www.morzze.com/bathroom/Towel-Warmers",
        },
      ],
    },
  },
];

export const categorySchemas: Record<string, any[]> = {
  "stainless-steel-sinks": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.morzze.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Kitchen",
          "item": "https://www.morzze.com/kitchen",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Stainless Steel Sinks",
          "item": "https://www.morzze.com/kitchen/stainless-steel-sinks",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-e01-701",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-e01-702",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-e01-703",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke01-706",
        },
        {
          "@type": "ListItem",
          "position": 5,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke02-713",
        },
        {
          "@type": "ListItem",
          "position": 6,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke01-714",
        },
        {
          "@type": "ListItem",
          "position": 7,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-e02-704",
        },
        {
          "@type": "ListItem",
          "position": 8,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke02-704b",
        },
        {
          "@type": "ListItem",
          "position": 9,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-e02-705",
        },
        {
          "@type": "ListItem",
          "position": 10,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke02-705b",
        },
        {
          "@type": "ListItem",
          "position": 11,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke02-707",
        },
        {
          "@type": "ListItem",
          "position": 12,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke02-708",
        },
        {
          "@type": "ListItem",
          "position": 13,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke02-709",
        },
        {
          "@type": "ListItem",
          "position": 14,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke02-710",
        },
        {
          "@type": "ListItem",
          "position": 15,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke02-711",
        },
        {
          "@type": "ListItem",
          "position": 16,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke02-712",
        },
        {
          "@type": "ListItem",
          "position": 17,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-801lx",
        },
        {
          "@type": "ListItem",
          "position": 18,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-801wa",
        },
        {
          "@type": "ListItem",
          "position": 19,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-802lx",
        },
        {
          "@type": "ListItem",
          "position": 20,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-802wa",
        },
        {
          "@type": "ListItem",
          "position": 21,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-803lx",
        },
        {
          "@type": "ListItem",
          "position": 22,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-803wa",
        },
        {
          "@type": "ListItem",
          "position": 23,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-804lx",
        },
        {
          "@type": "ListItem",
          "position": 24,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-804wa",
        },
        {
          "@type": "ListItem",
          "position": 25,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-805lx",
        },
        {
          "@type": "ListItem",
          "position": 26,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-805wa",
        },
        {
          "@type": "ListItem",
          "position": 27,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-806lx",
        },
        {
          "@type": "ListItem",
          "position": 28,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-806wa",
        },
        {
          "@type": "ListItem",
          "position": 29,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-812wa",
        },
        {
          "@type": "ListItem",
          "position": 30,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-813wa",
        },
        {
          "@type": "ListItem",
          "position": 31,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-814wa",
        },
        {
          "@type": "ListItem",
          "position": 32,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-807lx",
        },
        {
          "@type": "ListItem",
          "position": 33,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-807wa",
        },
        {
          "@type": "ListItem",
          "position": 34,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-808lx",
        },
        {
          "@type": "ListItem",
          "position": 35,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-808wa",
        },
        {
          "@type": "ListItem",
          "position": 36,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-809lx",
        },
        {
          "@type": "ListItem",
          "position": 37,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-809wa",
        },
        {
          "@type": "ListItem",
          "position": 38,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-810lx",
        },
        {
          "@type": "ListItem",
          "position": 39,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-810wa",
        },
        {
          "@type": "ListItem",
          "position": 40,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-811lx",
        },
        {
          "@type": "ListItem",
          "position": 41,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-811wa",
        },
        {
          "@type": "ListItem",
          "position": 42,
          "url":
            "https://www.morzze.com/product/stainless-steel-sink-p01-901",
        },
        {
          "@type": "ListItem",
          "position": 43,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-p01-902",
        },
        {
          "@type": "ListItem",
          "position": 44,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-p01-903",
        },
        {
          "@type": "ListItem",
          "position": 45,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-p01-904",
        },
        {
          "@type": "ListItem",
          "position": 46,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-p02-905",
        },
        {
          "@type": "ListItem",
          "position": 47,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-p02-906",
        },
        {
          "@type": "ListItem",
          "position": 48,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-p02-907",
        },
        {
          "@type": "ListItem",
          "position": 49,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-p03-908",
        },
      ],
    },
  ],
  "pulse": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.morzze.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Kitchen",
          "item": "https://www.morzze.com/kitchen",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Pulse Steel Sinks",
          "item": "https://www.morzze.com/kitchen/pulse",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url":
            "https://www.morzze.com/product/stainless-steel-sink-p01-901",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-p01-902",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-p01-903",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-p01-904",
        },
        {
          "@type": "ListItem",
          "position": 5,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-p02-905",
        },
        {
          "@type": "ListItem",
          "position": 6,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-p02-906",
        },
        {
          "@type": "ListItem",
          "position": 7,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-p02-907",
        },
        {
          "@type": "ListItem",
          "position": 8,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-p03-908",
        },
      ],
    },
  ],
  "neo": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.morzze.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Kitchen",
          "item": "https://www.morzze.com/kitchen",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Neo Steel Sink",
          "item": "https://www.morzze.com/kitchen/neo",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-801lx",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-801wa",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-802lx",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-802wa",
        },
        {
          "@type": "ListItem",
          "position": 5,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-803lx",
        },
        {
          "@type": "ListItem",
          "position": 6,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-803wa",
        },
        {
          "@type": "ListItem",
          "position": 7,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-804lx",
        },
        {
          "@type": "ListItem",
          "position": 8,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-804wa",
        },
        {
          "@type": "ListItem",
          "position": 9,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-805lx",
        },
        {
          "@type": "ListItem",
          "position": 10,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-805wa",
        },
        {
          "@type": "ListItem",
          "position": 11,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-806lx",
        },
        {
          "@type": "ListItem",
          "position": 12,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-806wa",
        },
        {
          "@type": "ListItem",
          "position": 13,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-812wa",
        },
        {
          "@type": "ListItem",
          "position": 14,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-813wa",
        },
        {
          "@type": "ListItem",
          "position": 15,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n01-814wa",
        },
        {
          "@type": "ListItem",
          "position": 16,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-807lx",
        },
        {
          "@type": "ListItem",
          "position": 17,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-807wa",
        },
        {
          "@type": "ListItem",
          "position": 18,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-808lx",
        },
        {
          "@type": "ListItem",
          "position": 19,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-808wa",
        },
        {
          "@type": "ListItem",
          "position": 20,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-809lx",
        },
        {
          "@type": "ListItem",
          "position": 21,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-809wa",
        },
        {
          "@type": "ListItem",
          "position": 22,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-810lx",
        },
        {
          "@type": "ListItem",
          "position": 23,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-810wa",
        },
        {
          "@type": "ListItem",
          "position": 24,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-811lx",
        },
        {
          "@type": "ListItem",
          "position": 25,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-n02-811wa",
        },
      ],
    },
  ],
  "edge-steel-sinks": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.morzze.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Kitchen",
          "item": "https://www.morzze.com/kitchen",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Edge Steel Sinks",
          "item": "https://www.morzze.com/kitchen/edge-steel-sinks",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-e01-701",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-e01-702",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-e01-703",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke01-706",
        },
        {
          "@type": "ListItem",
          "position": 5,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke02-713",
        },
        {
          "@type": "ListItem",
          "position": 6,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke01-714",
        },
        {
          "@type": "ListItem",
          "position": 7,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-e02-704",
        },
        {
          "@type": "ListItem",
          "position": 8,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke02-704b",
        },
        {
          "@type": "ListItem",
          "position": 9,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sink-e02-705",
        },
        {
          "@type": "ListItem",
          "position": 10,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke02-705b",
        },
        {
          "@type": "ListItem",
          "position": 11,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke02-707",
        },
        {
          "@type": "ListItem",
          "position": 12,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke02-708",
        },
        {
          "@type": "ListItem",
          "position": 13,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke02-709",
        },
        {
          "@type": "ListItem",
          "position": 14,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke02-710",
        },
        {
          "@type": "ListItem",
          "position": 15,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke02-711",
        },
        {
          "@type": "ListItem",
          "position": 16,
          "url":
            "https://www.morzze.com/product/stainless-steel-kitchen-sinke02-712",
        },
      ],
    },
  ],
  "Air-Tap": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.morzze.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Kitchen",
          "item": "https://www.morzze.com/kitchen",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Air Tap",
          "item": "https://www.morzze.com/kitchen/Air-Tap",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url": "https://www.morzze.com/product/Air-Tap-MAT-4010",
        },
      ],
    },
  ],
  "Food-Waste-Disposers": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.morzze.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Kitchen",
          "item": "https://www.morzze.com/kitchen",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Food Waste Disposers",
          "item": "https://www.morzze.com/kitchen/Food-Waste-Disposers",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url":
            "https://www.morzze.com/product/Food-Waste-Disposer-MFD-1101",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url":
            "https://www.morzze.com/product/Food-Waste-Disposer-MFD-1102",
        },
      ],
    },
  ],
  "Kitchen-Faucets": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.morzze.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Kitchen",
          "item": "https://www.morzze.com/kitchen",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Kitchen Faucet",
          "item": "https://www.morzze.com/kitchen/Kitchen-Faucets",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKCF-30435-11111",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKCF-30440-11111",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKCF-30441-11111",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKF-30421-11111",
        },
        {
          "@type": "ListItem",
          "position": 5,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKF-30421T-11111",
        },
        {
          "@type": "ListItem",
          "position": 6,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKF-30422-11111",
        },
        {
          "@type": "ListItem",
          "position": 7,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKF-30423-11111",
        },
        {
          "@type": "ListItem",
          "position": 8,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKF-30424-11111",
        },
        {
          "@type": "ListItem",
          "position": 9,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKF-30425-11111",
        },
        {
          "@type": "ListItem",
          "position": 10,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKF-30427-11111",
        },
        {
          "@type": "ListItem",
          "position": 11,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKF-30428-11111",
        },
        {
          "@type": "ListItem",
          "position": 12,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKF-30429-11111",
        },
        {
          "@type": "ListItem",
          "position": 13,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKF-30430-11111",
        },
        {
          "@type": "ListItem",
          "position": 14,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKF-30431-11111",
        },
        {
          "@type": "ListItem",
          "position": 15,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKF-30432-11111",
        },
        {
          "@type": "ListItem",
          "position": 16,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKF-30433-11111",
        },
        {
          "@type": "ListItem",
          "position": 17,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKF-30434-11111",
        },
        {
          "@type": "ListItem",
          "position": 18,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKF-30439-11111",
        },
        {
          "@type": "ListItem",
          "position": 19,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKF-30442-11111",
        },
        {
          "@type": "ListItem",
          "position": 20,
          "url":
            "https://www.morzze.com/product/multi-angle-rotating-kitchen-faucetmkf-30443",
        },
        {
          "@type": "ListItem",
          "position": 21,
          "url": "https://www.morzze.com/product/kitchen-faucet-mkf-30444",
        },
        {
          "@type": "ListItem",
          "position": 22,
          "url": "https://www.morzze.com/product/kitchen-faucet-mkf-30445",
        },
        {
          "@type": "ListItem",
          "position": 23,
          "url": "https://www.morzze.com/product/kitchen-faucet-mkf-30446",
        },
        {
          "@type": "ListItem",
          "position": 24,
          "url": "https://www.morzze.com/product/kitchen-faucet-mkf-30448",
        },
        {
          "@type": "ListItem",
          "position": 25,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKFF-30436-11111",
        },
        {
          "@type": "ListItem",
          "position": 26,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKFF-30437-11111",
        },
        {
          "@type": "ListItem",
          "position": 27,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKFF-30438-11111",
        },
        {
          "@type": "ListItem",
          "position": 28,
          "url": "https://www.morzze.com/product/kitchen-faucet-mkff-30447",
        },
        {
          "@type": "ListItem",
          "position": 29,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKFG-30426-11111",
        },
        {
          "@type": "ListItem",
          "position": 30,
          "url":
            "https://www.morzze.com/product/Kitchen-Faucet-MKF-30431-T-11111",
        },
      ],
    },
  ],
  "Granite-Sinks": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.morzze.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Kitchen",
          "item": "https://www.morzze.com/kitchen",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Granite Sink",
          "item": "https://www.morzze.com/kitchen/Granite-Sinks",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-101-11111",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-102-11111",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-103-11111",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-104-11111",
        },
        {
          "@type": "ListItem",
          "position": 5,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-105-11111",
        },
        {
          "@type": "ListItem",
          "position": 6,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-106-11111",
        },
        {
          "@type": "ListItem",
          "position": 7,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-111LX-11111",
        },
        {
          "@type": "ListItem",
          "position": 8,
          "url": "https://www.morzze.com/product/granite-kitchen-sinkv01-111wa",
        },
        {
          "@type": "ListItem",
          "position": 9,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-112LX-11111",
        },
        {
          "@type": "ListItem",
          "position": 10,
          "url":
            "https://www.morzze.com/product/granite-kitchen-sink-v01-112wa",
        },
        {
          "@type": "ListItem",
          "position": 11,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-113LX-11111",
        },
        {
          "@type": "ListItem",
          "position": 12,
          "url":
            "https://www.morzze.com/product/granite-kitchen-sink-v01-113wa",
        },
        {
          "@type": "ListItem",
          "position": 13,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-114LX-11111",
        },
        {
          "@type": "ListItem",
          "position": 14,
          "url":
            "https://www.morzze.com/product/granite-kitchen-sink-v01-114wa",
        },
        {
          "@type": "ListItem",
          "position": 15,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V02-107-11111",
        },
        {
          "@type": "ListItem",
          "position": 16,
          "url": "https://www.morzze.com/product/Granite-Kitchen-Sink-V02-108",
        },
        {
          "@type": "ListItem",
          "position": 17,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink--V02-115LX-11111",
        },
        {
          "@type": "ListItem",
          "position": 18,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink--V02-115WA-11111",
        },
        {
          "@type": "ListItem",
          "position": 19,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink--V02-116LX-11111",
        },
        {
          "@type": "ListItem",
          "position": 20,
          "url":
            "https://www.morzze.com/product/kitchen-granite-sink-v02-116wa",
        },
        {
          "@type": "ListItem",
          "position": 21,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink--V02-117LX-11111",
        },
        {
          "@type": "ListItem",
          "position": 22,
          "url":
            "https://www.morzze.com/product/kitchen-granite-sink-v02-117wa",
        },
        {
          "@type": "ListItem",
          "position": 23,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink--V02-118LX-11111",
        },
        {
          "@type": "ListItem",
          "position": 24,
          "url":
            "https://www.morzze.com/product/kitchen-granite-sink-v02-118wa",
        },
        {
          "@type": "ListItem",
          "position": 25,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink--V02-119LX-11111",
        },
        {
          "@type": "ListItem",
          "position": 26,
          "url":
            "https://www.morzze.com/product/kitchen-granite-sink-v02-119wa",
        },
        {
          "@type": "ListItem",
          "position": 27,
          "url":
            "https://www.morzze.com/product/kitchen-granite-sink-v02-120wa",
        },
        {
          "@type": "ListItem",
          "position": 28,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V03-109-11111",
        },
        {
          "@type": "ListItem",
          "position": 29,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V03-110-11111",
        },
        {
          "@type": "ListItem",
          "position": 30,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink--V03-120LX-11111",
        },
      ],
    },
  ],
  "Vertex": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.morzze.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Kitchen",
          "item": "https://www.morzze.com/kitchen",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Vertex Granite Sink",
          "item": "https://www.morzze.com/kitchen/Vertex",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-101-11111",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-102-11111",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-103-11111",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-104-11111",
        },
        {
          "@type": "ListItem",
          "position": 5,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-105-11111",
        },
        {
          "@type": "ListItem",
          "position": 6,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-106-11111",
        },
        {
          "@type": "ListItem",
          "position": 7,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-111LX-11111",
        },
        {
          "@type": "ListItem",
          "position": 8,
          "url": "https://www.morzze.com/product/granite-kitchen-sinkv01-111wa",
        },
        {
          "@type": "ListItem",
          "position": 9,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-112LX-11111",
        },
        {
          "@type": "ListItem",
          "position": 10,
          "url":
            "https://www.morzze.com/product/granite-kitchen-sink-v01-112wa",
        },
        {
          "@type": "ListItem",
          "position": 11,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-113LX-11111",
        },
        {
          "@type": "ListItem",
          "position": 12,
          "url":
            "https://www.morzze.com/product/granite-kitchen-sink-v01-113wa",
        },
        {
          "@type": "ListItem",
          "position": 13,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V01-114LX-11111",
        },
        {
          "@type": "ListItem",
          "position": 14,
          "url":
            "https://www.morzze.com/product/granite-kitchen-sink-v01-114wa",
        },
        {
          "@type": "ListItem",
          "position": 15,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V02-107-11111",
        },
        {
          "@type": "ListItem",
          "position": 16,
          "url": "https://www.morzze.com/product/Granite-Kitchen-Sink-V02-108",
        },
        {
          "@type": "ListItem",
          "position": 17,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink--V02-115LX-11111",
        },
        {
          "@type": "ListItem",
          "position": 18,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink--V02-115WA-11111",
        },
        {
          "@type": "ListItem",
          "position": 19,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink--V02-116LX-11111",
        },
        {
          "@type": "ListItem",
          "position": 20,
          "url":
            "https://www.morzze.com/product/kitchen-granite-sink-v02-116wa",
        },
        {
          "@type": "ListItem",
          "position": 21,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink--V02-117LX-11111",
        },
        {
          "@type": "ListItem",
          "position": 22,
          "url":
            "https://www.morzze.com/product/kitchen-granite-sink-v02-117wa",
        },
        {
          "@type": "ListItem",
          "position": 23,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink--V02-118LX-11111",
        },
        {
          "@type": "ListItem",
          "position": 24,
          "url":
            "https://www.morzze.com/product/kitchen-granite-sink-v02-118wa",
        },
        {
          "@type": "ListItem",
          "position": 25,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink--V02-119LX-11111",
        },
        {
          "@type": "ListItem",
          "position": 26,
          "url":
            "https://www.morzze.com/product/kitchen-granite-sink-v02-119wa",
        },
        {
          "@type": "ListItem",
          "position": 27,
          "url":
            "https://www.morzze.com/product/kitchen-granite-sink-v02-120wa",
        },
        {
          "@type": "ListItem",
          "position": 28,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V03-109-11111",
        },
        {
          "@type": "ListItem",
          "position": 29,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink-V03-110-11111",
        },
        {
          "@type": "ListItem",
          "position": 30,
          "url":
            "https://www.morzze.com/product/Granite-Kitchen-Sink--V03-120LX-11111",
        },
      ],
    },
  ],
  "Kitchen-Accessories": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.morzze.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Kitchen",
          "item": "https://www.morzze.com/kitchen",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Kitchen Accessories",
          "item": "https://www.morzze.com/kitchen/Kitchen-Accessories",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url":
            "https://www.morzze.com/product/Sink-Drainer-Adapter-MDA-901",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url":
            "https://www.morzze.com/product/Sink-Drainer-Adapter-MDA-902",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "url":
            "https://www.morzze.com/product/Sink-Drainer-Adapter-MDA-903",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "url":
            "https://www.morzze.com/product/Sink-Drainer-Adapter-MDA-904",
        },
        {
          "@type": "ListItem",
          "position": 5,
          "url":
            "https://www.morzze.com/product/Sink-Drainer-Adapter-MDA-905",
        },
        {
          "@type": "ListItem",
          "position": 6,
          "url": "https://www.morzze.com/product/Drain-Pipe-MDP-45",
        },
        {
          "@type": "ListItem",
          "position": 7,
          "url": "https://www.morzze.com/product/Drain-Pipe-MDP-46",
        },
        {
          "@type": "ListItem",
          "position": 8,
          "url": "https://www.morzze.com/product/Drain-Pipe-MDP-47",
        },
        {
          "@type": "ListItem",
          "position": 9,
          "url": "https://www.morzze.com/product/Drain-Pipe-MDP-48",
        },
        {
          "@type": "ListItem",
          "position": 10,
          "url": "https://www.morzze.com/product/Drain-Pipe-MDP-49",
        },
        {
          "@type": "ListItem",
          "position": 11,
          "url": "https://www.morzze.com/product/Drain-Pipe-MDP-50",
        },
        {
          "@type": "ListItem",
          "position": 12,
          "url": "https://www.morzze.com/product/Drain-Pipe-MDP-51",
        },
        {
          "@type": "ListItem",
          "position": 13,
          "url": "https://www.morzze.com/product/Sink-Strainer-MGS-502",
        },
        {
          "@type": "ListItem",
          "position": 14,
          "url": "https://www.morzze.com/product/Hand-Shower-MHS-31",
        },
        {
          "@type": "ListItem",
          "position": 15,
          "url":
            "https://www.morzze.com/product/Liquid-Soap-Dispenser-MSD-21",
        },
        {
          "@type": "ListItem",
          "position": 16,
          "url":
            "https://www.morzze.com/product/Liquid-Soap-Dispenser-MSD-23",
        },
        {
          "@type": "ListItem",
          "position": 17,
          "url": "https://www.morzze.com/product/Sink-Strainer-MSS-501",
        },
      ],
    },
  ],
  "Bathroom-Basins": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.morzze.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Bathroom",
          "item": "https://www.morzze.com/bathroom",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Wash Basins",
          "item": "https://www.morzze.com/bathroom/Bathroom-Basins",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url":
            "https://www.morzze.com/product/Granite-Wash-Basin-MBB-401-11111",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url": "https://www.morzze.com/product/Granite-Wash-Basin-MBB-402",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "url": "https://www.morzze.com/product/Granite-Wash-Basin-MBB-403",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "url": "https://www.morzze.com/product/Granite-Wash-Basin-MBB-404",
        },
      ],
    },
  ],
  "Bathroom-Faucets": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.morzze.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Bathroom",
          "item": "https://www.morzze.com/bathroom",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Bathroom Faucets",
          "item": "https://www.morzze.com/bathroom/Bathroom-Faucets",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url": "https://www.morzze.com/product/bathroom-faucets-mbf-501",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url": "https://www.morzze.com/product/bathroom-faucets-mbf-501T",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "url":
            "https://www.morzze.com/product/BATHROOM-FAUCET--MBF-502-11111",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "url": "https://www.morzze.com/product/bathroom-faucets-mbf-503",
        },
        {
          "@type": "ListItem",
          "position": 5,
          "url": "https://www.morzze.com/product/bathroom-faucets-mbf-505",
        },
        {
          "@type": "ListItem",
          "position": 6,
          "url": "https://www.morzze.com/product/bathroom-faucets-mbf-506",
        },
        {
          "@type": "ListItem",
          "position": 7,
          "url": "https://www.morzze.com/product/bathroom-faucets-mbf-507",
        },
        {
          "@type": "ListItem",
          "position": 8,
          "url": "https://www.morzze.com/product/bathroom-faucets-mbf-508",
        },
        {
          "@type": "ListItem",
          "position": 9,
          "url": "https://www.morzze.com/product/bathroom-faucets-mbf-509",
        },
        {
          "@type": "ListItem",
          "position": 10,
          "url":
            "https://www.morzze.com/product/BATHROOM-FAUCET-MBF-510-11111",
        },
        {
          "@type": "ListItem",
          "position": 11,
          "url": "https://www.morzze.com/product/bathroom-faucet-mbf-5101",
        },
        {
          "@type": "ListItem",
          "position": 12,
          "url": "https://www.morzze.com/product/bathroom-faucet-mbf-5102",
        },
        {
          "@type": "ListItem",
          "position": 13,
          "url": "https://www.morzze.com/product/bathroom-faucet-mbf-5103",
        },
        {
          "@type": "ListItem",
          "position": 14,
          "url": "https://www.morzze.com/product/bathroom-faucet-mbf-5104",
        },
        {
          "@type": "ListItem",
          "position": 15,
          "url": "https://www.morzze.com/product/bathroom-faucet-mbf-5105",
        },
        {
          "@type": "ListItem",
          "position": 16,
          "url": "https://www.morzze.com/product/bathroom-faucet-mbf-5106",
        },
      ],
    },
  ],
  "Floor-Drainers": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.morzze.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Bathroom",
          "item": "https://www.morzze.com/bathroom",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Floor Drainer",
          "item": "https://www.morzze.com/bathroom/Floor-Drainers",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url": "https://www.morzze.com/product/Floor-Drainer-MBD-604-11111",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url": "https://www.morzze.com/product/Floor-Drainer-MBD-605-11111",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "url": "https://www.morzze.com/product/Floor-Drainer-MBD-606-11111",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "url": "https://www.morzze.com/product/Floor-Drainer-MBD-607-11111",
        },
        {
          "@type": "ListItem",
          "position": 5,
          "url": "https://www.morzze.com/product/Floor-Drainer-MBD-608-11111",
        },
        {
          "@type": "ListItem",
          "position": 6,
          "url": "https://www.morzze.com/product/Floor-Drainer-MBD-609-11111",
        },
        {
          "@type": "ListItem",
          "position": 7,
          "url": "https://www.morzze.com/product/Floor-Drainer-MBD-610-11111",
        },
        {
          "@type": "ListItem",
          "position": 8,
          "url": "https://www.morzze.com/product/Floor-Drainer-MBD-611-11111",
        },
        {
          "@type": "ListItem",
          "position": 9,
          "url": "https://www.morzze.com/product/Floor-Drainer-MBD-612-11111",
        },
        {
          "@type": "ListItem",
          "position": 10,
          "url": "https://www.morzze.com/product/Floor-Drainer-MBD-613-11111",
        },
        {
          "@type": "ListItem",
          "position": 11,
          "url": "https://www.morzze.com/product/Floor-Drainer-MBD-614-11111",
        },
        {
          "@type": "ListItem",
          "position": 12,
          "url": "https://www.morzze.com/product/Floor-Drainer-MSD-601-11111",
        },
        {
          "@type": "ListItem",
          "position": 13,
          "url": "https://www.morzze.com/product/Floor-Drainer-MSD-602-11111",
        },
        {
          "@type": "ListItem",
          "position": 14,
          "url": "https://www.morzze.com/product/Floor-Drainer-MSD-603-11111",
        },
      ],
    },
  ],
  "Towel-Warmers": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.morzze.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Bathroom",
          "item": "https://www.morzze.com/bathroom",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Towel Warmer",
          "item": "https://www.morzze.com/bathroom/Towel-Warmers",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url":
            "https://www.morzze.com/product/Electric-Round--Towel-Warmer-Wall-Mounted-MTW-11050-11111",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url":
            "https://www.morzze.com/product/Electric-Round--Towel-Warmer-Wall-Mounted-MTW-12050-11111",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "url":
            "https://www.morzze.com/product/Electric-Round--Towel-Warmer-Wall-Mounted-MTW-6040-11111",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "url":
            "https://www.morzze.com/product/Electric-Round--Towel-Warmer-Wall-Mounted-MTW-8050-11111",
        },
      ],
    },
  ],
};
