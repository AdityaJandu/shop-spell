import { relations } from "drizzle-orm";
import {
    pgTable,
    pgEnum,
    text,
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

export const sellerProfileRelations = relations(sellerProfiles, ({ one }) => ({
    user: one(user, {
        fields: [sellerProfiles.userId],
        references: [user.id],
    }),
    // stores relation will be added when we create the stores schema
}));

// ─── Exported Types ───────────────────────────────────────────────────────────

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert
export type SellerProfile = typeof sellerProfiles.$inferSelect
export type NewSellerProfile = typeof sellerProfiles.$inferInsert