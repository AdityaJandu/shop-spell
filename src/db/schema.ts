import { relations } from "drizzle-orm";
import {
    pgTable,
    pgEnum,
    text,
    varchar,
    integer,
    numeric,
    json,
    serial,
    timestamp,
    boolean,
    index,
    uuid,
    uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", [
    "seller",
    "admin",
]);

export const orderStatusEnum = pgEnum("order_status", [
    "New",
    "Processing",
    "Shipped",
    "Delivered",
    "Refunded",
]);

export const discountTypeEnum = pgEnum("discount_type", [
    "percentage",
    "fixed",
]);

// ─── BetterAuth Core Tables (DO NOT MODIFY STRUCTURE) ─────────────────────────

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),

    // ShopSpell additions
    role: userRoleEnum("role").default("seller").notNull(),
    onboarded: boolean("onboarded").default(false).notNull(),
    // onboarded = false means they haven't described their store yet
    // flips to true after first store is created via chat

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ─── Seller Profile ───────────────────────────────────────────────────────────
// Extends the BetterAuth user with seller-specific info.
// Created automatically when a user first signs up.

export const sellerProfiles = pgTable(
    "seller_profiles",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: text("user_id")
            .notNull()
            .unique() // one seller profile per user
            .references(() => user.id, { onDelete: "cascade" }),

        // Display info
        displayName: text("display_name"),   // store owner's public name
        bio: text("bio"),            // optional short bio
        avatarUrl: text("avatar_url"),     // can differ from auth image

        // Contact
        phone: text("phone"),          // for order notification fallback
        country: text("country"),        // used to default currency

        // Billing / Payout (filled in later, not at signup)
        razorpayAccountId: text("razorpay_account_id"),
        stripeAccountId: text("stripe_account_id"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        uniqueIndex("seller_profiles_userId_idx").on(table.userId),
    ],
);

// ─── Stores ───────────────────────────────────────────────────────────────────

export const stores = pgTable(
    "stores",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        ownerId: varchar("owner_id", { length: 36 }).notNull(),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description"),
        logoUrl: text("logo_url"),
        bannerUrl: text("banner_url"),
        stitchProjectId: varchar("stitch_project_id", { length: 255 }),
        designTokens: json("design_tokens").$type<Record<string, string>>(),
        isPublic: boolean("is_public").default(true).notNull(),
        primaryColor: varchar("primary_color", { length: 7 }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (t) => ({ ownerIdx: index("stores_owner_idx").on(t.ownerId) })
);

// ─── Products ─────────────────────────────────────────────────────────────────

export const products = pgTable(
    "products",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        storeId: varchar("store_id", { length: 36 })
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description"),
        price: numeric("price", { precision: 10, scale: 2 }).notNull(),
        stock: integer("stock").notNull().default(0),
        category: varchar("category", { length: 100 }),
        imageUrls: json("image_urls").$type<string[]>().default([]),
        isActive: boolean("is_active").default(true).notNull(),
        totalSold: integer("total_sold").default(0).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (t) => ({
        storeIdx: index("products_store_idx").on(t.storeId),
        categoryIdx: index("products_category_idx").on(t.category),
    })
);

// ─── Orders ───────────────────────────────────────────────────────────────────

export const orders = pgTable(
    "orders",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        storeId: varchar("store_id", { length: 36 })
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),
        customerId: varchar("customer_id", { length: 36 }),
        customerEmail: varchar("customer_email", { length: 255 }),
        customerName: varchar("customer_name", { length: 255 }),
        status: orderStatusEnum("status").default("New").notNull(),
        totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
        couponCode: varchar("coupon_code", { length: 50 }),
        discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).default("0"),
        notes: text("notes"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (t) => ({
        storeIdx: index("orders_store_idx").on(t.storeId),
        statusIdx: index("orders_status_idx").on(t.status),
        createdAtIdx: index("orders_created_at_idx").on(t.createdAt),
    })
);

export const orderItems = pgTable("order_items", {
    id: serial("id").primaryKey(),
    orderId: varchar("order_id", { length: 36 })
        .notNull()
        .references(() => orders.id, { onDelete: "cascade" }),
    productId: varchar("product_id", { length: 36 })
        .notNull()
        .references(() => products.id),
    productName: varchar("product_name", { length: 255 }).notNull(),
    quantity: integer("quantity").notNull(),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
});

// ─── Coupons ──────────────────────────────────────────────────────────────────

export const coupons = pgTable(
    "coupons",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        storeId: varchar("store_id", { length: 36 })
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),
        code: varchar("code", { length: 50 }).notNull(),
        discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).notNull(),
        discountType: discountTypeEnum("discount_type").notNull(),
        maxUses: integer("max_uses").notNull(),
        currentUses: integer("current_uses").default(0).notNull(),
        expiryDate: timestamp("expiry_date"),
        isActive: boolean("is_active").default(true).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (t) => ({
        storeIdx: index("coupons_store_idx").on(t.storeId),
        codeIdx: index("coupons_code_idx").on(t.code),
    })
);

// ─── Chat Messages ────────────────────────────────────────────────────────────

export const chatMessages = pgTable(
    "chat_messages",
    {
        id: serial("id").primaryKey(),
        storeId: varchar("store_id", { length: 36 })
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),
        role: varchar("role", { length: 10 }).$type<"user" | "assistant">().notNull(),
        content: text("content").notNull(),
        toolCalls: json("tool_calls").$type<unknown[]>(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (t) => ({ storeIdx: index("chat_store_idx").on(t.storeId) })
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const userRelations = relations(user, ({ one, many }) => ({
    sessions: many(session),
    accounts: many(account),
    sellerProfile: one(sellerProfiles, {
        fields: [user.id],
        references: [sellerProfiles.userId],
    }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const sellerProfileRelations = relations(sellerProfiles, ({ one, many }) => ({
    user: one(user, {
        fields: [sellerProfiles.userId],
        references: [user.id],
    }),
}));

export const storesRelations = relations(stores, ({ many }) => ({
    products: many(products),
    orders: many(orders),
    coupons: many(coupons),
    chatMessages: many(chatMessages),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
    store: one(stores, { fields: [products.storeId], references: [stores.id] }),
    orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
    store: one(stores, { fields: [orders.storeId], references: [stores.id] }),
    items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
    product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const couponsRelations = relations(coupons, ({ one }) => ({
    store: one(stores, { fields: [coupons.storeId], references: [stores.id] }),
}));

// ─── Exported Types ───────────────────────────────────────────────────────────

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type SellerProfile = typeof sellerProfiles.$inferSelect;
export type NewSellerProfile = typeof sellerProfiles.$inferInsert;
export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;