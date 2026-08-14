

import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
  text,
  serial,
  integer,
  index,
  primaryKey,
  jsonb,
  pgEnum,
  json,
  decimal
} from "drizzle-orm/pg-core";


// ================= USERS =================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: varchar("phone", { length: 15 }).notNull(),
  password: text("password").notNull(),
  emailVerified: boolean("email_verified").default(false),
  rewardOrderCoins: integer("reward_order_coins").default(0),
  referralCoins: integer("referral_coins").default(0),


  otp: varchar("otp", { length: 6 }),
  otpExpiresAt: timestamp("otp_expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rewardCoinsHistory = pgTable("reward_coins_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  coins: integer("coins").notNull(),
  type: varchar("type"),
  orderId: uuid("order_id").references(() => order.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const referralCoinHistory = pgTable("referral_coin_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  coins: integer("coins").notNull(),
  type: varchar("type"),
  newUserName: varchar("new_user_name"),
  newUserId: uuid("new_user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});



// ================= ADDRESS =================

export const address = pgTable("address", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  fullName: varchar("full_name"),
  phone: varchar("phone"),
  email: varchar("email"),

  street: text("street"),
  locality: varchar("locality"),
  city: varchar("city"),
  state: varchar("state"),
  pincode: varchar("pincode"),
  country: varchar("country"),

  isDefault: boolean("is_default").default(false),

  createdAt: timestamp("created_at").defaultNow(),
});


// ================= BLOG =================

export const blog = pgTable("blog", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title"),
  metaTitle: varchar("meta_title"),
  metaDescription: varchar("meta_description"),
  blogCategory: varchar("blog_category"),
  image: varchar("image"),
  tags: varchar("tags").array(),
  date: varchar("date"),
  data: text("data"),
  userImage: varchar("user_image"),
  textArea: varchar("text_area"),
  userName: varchar("user_name"),
  slug: varchar("slug"),
  isVisible: boolean("is_visible").default(true),
});

// ================= VIDEOS =================

export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  link: text("link").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  thumbnail: text("thumbnail"),
  videoDescription: text("video_description"),
  videoCategory: varchar("video_category", { length: 100 }),
  isVisible: boolean("is_visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= COUPON =================
export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  category: varchar("category", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  couponCode: varchar("coupon_code", { length: 100 }).notNull(),
  discountValue: varchar("discount_value", { length: 50 }).notNull(),
  upto: varchar("upto", { length: 100 }),
  minimumOrder: varchar("minimum_order", { length: 100 }),
  validUntil: timestamp("valid_until"),
  termsPdf: text("terms_pdf"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= CATEGORY =================

export const categoryType = pgEnum("categoryType", ["kitchen", "bathroom"])

export const category = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  slug: varchar("slug").unique().notNull(),
  bannerImage: varchar("banner_image"),
  horizontalBannerImage: varchar("horizontal_banner_image"),
  description: varchar("description"),
  type: categoryType("type"),
  updatedAt: timestamp("updated_at").defaultNow(),

  metaTitle: varchar("meta_title"),
  metaDescription: varchar("meta_description"),
  metaOgImage: varchar("meta_og_image")
});

export const productBrandEnum = pgEnum("product_brand", ["ovy", "loway"]);


// ================= PRODUCT =================

export const product = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),

  sku: varchar("sku").notNull().unique(),
  slug: varchar("slug").unique().notNull(),

  name: varchar("name"),
  description: varchar("description"),

  basePrice: integer("base_price"),
  strikethroughPrice: integer("strikethrough_price"),

  bannerImage: varchar("banner_image"),
  highlights: varchar("highlights").array(),
  brand: productBrandEnum("brand").default("ovy"),

  hasVarientBox: boolean("has_variant_box").default(false),
  minBoxQuintity: integer("min_box_quintity"),
  custimizeBoxInfo: text("custimize_box_info"),

  isInStock: boolean("is_in_stock").default(true),

  rateing5Star: integer("rateing_5_star").default(0),
  rateing4Star: integer("rateing_4_star").default(0),
  rateing3Star: integer("rateing_3_star").default(0),
  rateing2Star: integer("rateing_2_star").default(0),
  rateing1Star: integer("rateing_1_star").default(0),

  isHidden: boolean("is_hidden").default(false),

  size: varchar("size"),
  flowType: varchar("flow_type"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  sizePrices: jsonb("size_prices").array(),
  metaTitle: varchar("meta_title"),
  metaDescription: varchar("meta_description"),
  metaOgImage: varchar("meta_og_image")
},
  (table) => [
    index("hidden_idx").on(table.isHidden),
    index("name_idx").on(table.name),
    index("slug_idx").on(table.slug),
  ]
);

export const productVarientBox = pgTable("product_varient_box", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").references(() => product.id),
  name: varchar("name"),
  description: varchar("description"),
  image: varchar("image"),
});

// ================= PRODUCT CATEGORY =================

export const productCategory = pgTable(
  "product_category",
  {
    productId: uuid("product_id").notNull().references(() => product.id),
    categoryId: uuid("category_id").notNull().references(() => category.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.productId, table.categoryId] }),
  })
);

// ================= PRODUCT FILTER =================

export const productFilter = pgTable(
  "product_filter",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    productId: uuid("product_id")
      .references(() => product.id)
      .notNull(),

    filter: varchar("filter").notNull(),

    type: varchar("type", { length: 50 }),
  },
  (table) => [
    index("filter_idx").on(table.filter),
    index("type_idx").on(table.type),
    index("product_id_idx").on(table.productId),
  ],
);



// ================= PRODUCT MEDIA =================

export const productMedia = pgTable("product_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").references(() => product.id),
  mediaType: varchar("media_type"),
  mediaURL: varchar("media_url"),
  priority: integer("priority"),
  title: text("title"),
});


// ================= PRODUCT ATTRIBUTE =================

export const productAttribute = pgTable("product_attribute", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").references(() => product.id),
  attribute: varchar("attribute"),
  value: text("value"),
});


// ================= REVIEW =================

export const review = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  productId: uuid("product_id").references(() => product.id),
  name: varchar("name"),
  email: varchar("email"),
  rating: integer("rating"),
  message: varchar("message"),
  isAdminApproved: boolean("is_admin_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});


// ================= REVIEW MEDIA =================

export const reviewMedia = pgTable("review_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewId: uuid("review_id").references(() => review.id),
  mediaType: varchar("media_type"),
  mediaURL: varchar("media_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= SUBSCRIPTIONS =================

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  frequencyInMonths: integer("frequency_in_months"),
  nextOrderDate: timestamp("next_order_date"),
  status: text("status").default("active"),
  orderId: uuid("order_id")
});


// ================= CART =================

export const cart = pgTable("cart", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});


// ================= CART ITEMS =================

export const cartItem = pgTable("cart_item", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: uuid("cart_id").references(() => cart.id).notNull(),
  productId: uuid("product_id").references(() => product.id).notNull(),
  productVarientBox: uuid("product_varient_box_id").references(() => productVarientBox.id),
  selectedSize: varchar("selected_size"),
  isTypeSubscription: boolean("is_type_subscription").default(false),
  frequencyInMonths: integer("frequency_in_months"),
  clientCartItemId: uuid("client_cart_item_id"), //can be same for different varient for same product item added at a time which means a single cart item.
  quantity: integer("quantity").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= wishlist =================


export const wishlist = pgTable("wishlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});


// ================= wishlist ITEMS =================

export const wishlistItem = pgTable("wishlist_item", {
  id: uuid("id").primaryKey().defaultRandom(),
  wishlistId: uuid("wishlist_id").references(() => wishlist.id),
  productId: uuid("product_id").references(() => product.id),
  createdAt: timestamp("created_at").defaultNow(),
});


// ================= ORDER =================

export const order = pgTable("order", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  status: varchar("status").default("pending"),
  shippingProvider: varchar("shipping_provider").default("envia"),
  trackingNumber: varchar("tracking_number"),
  trackingUrl: text("tracking_url"),
  shippingStatus: varchar("shipping_status").default("processing"),
  shipmentId: varchar("shipment_id"),
  courierName: varchar("courier_name"),
  estimatedDeliveryDate: timestamp("estimated_delivery_date"),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  subscriptionId: integer("subscription_id").references(() => subscriptions.id),
  addressLine1: varchar("address_line_1"),
  addressLine2: varchar("address_line_2"),
  city: varchar("city"),
  state: varchar("state"),
  pincode: varchar("pincode"),

  subtotalAmount: integer("subtotal_amount"),
  discountAmount: integer("discount_amount").default(0),
  couponCode: varchar("coupon_code"),
  totalAmount: integer("total_amount"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


// ================= ORDER ITEM =================

export const orderItem = pgTable("order_item", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => order.id),
  productId: uuid("product_id").references(() => product.id),
  productVarientBox: varchar("product_varient_box"),
  quantity: integer("quantity"),

  productName: varchar("product_name"),
  productSlug: varchar("product_slug"),
  productImage: varchar("product_image"),
  productPrice: integer("product_price"),
  productSKU: varchar("product_sku"),
});


// ================= PAYMENT =================

export const payment = pgTable("payment", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => order.id),

  paymentId: varchar("payment_id"),
  paymentStatus: varchar("payment_status"),
  paymentMethod: varchar("payment_method"),

  paymentAmount: integer("payment_amount"),
  paymentOrderId: varchar("payment_order_id"),
  paymentMeta: jsonb("payment_meta"),
  createdAt: timestamp("created_at").defaultNow(),
});


// ================= SUBSCRIPTION PAYMENT =================

export const subscriptionPayment = pgTable("subscription_payment", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const paymentGatewayPlans = pgTable("payment_gateway_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  price: integer("price").notNull(),
  descirption: varchar("descirption"),
  billingFrequency: varchar("billing_frequency").notNull(),
  planId: varchar("plan_id").notNull().unique(),
  frequencyType: varchar("frequency_type").notNull().default("monthly"),
});

export const paymentGatewaySubscription = pgTable("payment_gateway_subscription", {
  id: uuid("id").primaryKey().defaultRandom(),
  planId: varchar("plan_id").notNull().references(() => paymentGatewayPlans.planId),
  totalCount: integer("total_count"),
  remainingCount: integer("remaining_count"),
  quantity: integer("quantity"),
  customerNotify: boolean("customer_notify").default(false),
  startAt: timestamp("start_at"),
  expireBy: timestamp("expire_by"),
  shourURL: varchar("shour_url"),
  startDate: timestamp("start_date").defaultNow(),

});

// ================= CATALOGUE =================

export const catalogue = pgTable("catalogues", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title").notNull(),
  slug: varchar("slug").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  image: varchar("image").notNull(),
  pdfFile: varchar("pdf_file").notNull(),
  totalPages: integer("total_pages").notNull(),
  fileSize: varchar("file_size").notNull(),
  publishYear: varchar("publish_year").notNull(),
  category: varchar("category").notNull(),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
},
  (table) => [
    index("catalogue_slug_idx").on(table.slug),
    index("catalogue_category_idx").on(table.category),
    index("catalogue_featured_idx").on(table.isFeatured),
  ]
);


// ================= CAREER ENQUIRIES=================

export const careerEnquiries = pgTable("career_enquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  mobileNumber: text("mobile_number").notNull(),
  resumeUrl: text("resume_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= PRODUCT FAQ =================

export const productFaq = pgTable("product_faq", {
  id: uuid("id").defaultRandom().primaryKey(),

  productId: uuid("product_id")
    .references(() => product.id, {
      onDelete: "cascade",
    })
    .notNull(),
  question: varchar("question", { length: 500 }).notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stores = pgTable("stores", {
  id: uuid("id").defaultRandom().primaryKey(),

  storeName: varchar("store_name", { length: 255 }).notNull(),

  slug: varchar("slug", { length: 255 }).unique().notNull(),

  storeType: varchar("store_type", { length: 100 }).notNull(),

  state: varchar("state", { length: 150 }).notNull(),

  city: varchar("city", { length: 150 }).notNull(),
  contactPersonName: varchar("contact_person_name", { length: 255 }),
  landLineNumber: varchar("land_line_number", { length: 20 }),
  latitude: decimal("latitude", {
    precision: 10,
    scale: 7,
  }).notNull(),

  longitude: decimal("longitude", {
    precision: 10,
    scale: 7,
  }).notNull(),

  address: text("address").notNull(),

  contactNumber: varchar("contact_number", {
    length: 20,
  }).notNull(),

  email: varchar("email", {
    length: 255,
  }).notNull(),

  workingHours: varchar("working_hours", {
    length: 255,
  }).notNull(),

  features: json("features").$type<string[]>(),

  badgeBgColor: varchar("badge_bg_color", {
    length: 50,
  }),

  badgeTextColor: varchar("badge_text_color", {
    length: 50,
  }),

  mapEmbedUrl: text("map_embed_url"),

  isFeatured: boolean("is_featured").default(false),

  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),
});
