import {
  pgTable,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core"

// ─── Enums ────────────────────────────────────────────────────────────────────

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
])

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
])

export const categoryEnum = pgEnum("category", [
  "jewellery",
  "clothing",
  "decor",
  "custom_food",
])

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  avatarUrl: text("avatar_url"),
  patronSince: timestamp("patron_since").defaultNow(),
  totalTips: numeric("total_tips", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// ─── Artisans ─────────────────────────────────────────────────────────────────

export const artisans = pgTable("artisans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  bio: text("bio"),
  specialty: text("specialty"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
})

// ─── Products ─────────────────────────────────────────────────────────────────

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  category: categoryEnum("category").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  artisanId: uuid("artisan_id").references(() => artisans.id),
  imageUrls: text("image_urls").array(),
  inStock: boolean("in_stock").default(true),
  handcrafted: boolean("handcrafted").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// ─── Orders ───────────────────────────────────────────────────────────────────

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  status: orderStatusEnum("status").default("pending"),
  paymentStatus: paymentStatusEnum("payment_status").default("pending"),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  artisanTip: numeric("artisan_tip", { precision: 10, scale: 2 }).default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: text("shipping_address"),
  giftMessage: text("gift_message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// ─── Order Items ──────────────────────────────────────────────────────────────

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id),
  productName: text("product_name").notNull(),
  variant: text("variant"),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
})

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export const wishlist = pgTable("wishlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  addedAt: timestamp("added_at").defaultNow(),
})

// ─── Custom Orders ────────────────────────────────────────────────────────────

export const customOrders = pgTable("custom_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  artisanId: uuid("artisan_id").references(() => artisans.id),
  description: text("description").notNull(),
  status: orderStatusEnum("status").default("pending"),
  estimatedDelivery: text("estimated_delivery"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
export type OrderItem = typeof orderItems.$inferSelect
export type Artisan = typeof artisans.$inferSelect
