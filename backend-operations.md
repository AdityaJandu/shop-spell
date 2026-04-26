# ShopSpell Backend Operations (tRPC)

This document outlines the planned backend procedures required for the ShopSpell platform, mapped to their respective frontend modules and features. We will use tRPC to maintain end-to-end type safety between the database (Drizzle) and the Next.js frontend.

## 1. Store / Project Operations (`storeRouter`)

These operations manage the core storefront entities.

- **`createStore` (Mutation)**
  - **Usage:** Onboarding flow (`/onboarding`).
  - **Input:** `{ prompt: string }`
  - **Action:** Triggers the AI generation process to create a store's foundation (design tokens, metadata) and saves it to the database.
  
- **`getStore` (Query)**
  - **Usage:** Dashboard pages (to verify ownership and fetch store settings).
  - **Input:** `{ storeId: string }`
  - **Action:** Fetches the store's details, including the selected Stitch project ID and branding.

- **`listAllStores` (Query)**
  - **Usage:** Explore Page (`/explore`).
  - **Input:** `{ cursor?: number, limit?: number }` (for pagination)
  - **Action:** Retrieves a list of active public stores on the platform to display in the marketplace.

## 2. Product Operations (`productRouter`)

Manages inventory and marketplace listings.

- **`createProduct` (Mutation)**
  - **Usage:** Products Page (`AddProductDrawer`).
  - **Input:** `{ storeId: string, name: string, price: number, stock: number, category: string, prompt?: string, imageUrls: string[] }`
  - **Action:** Adds a new product to the specified store. Optionally uses an AI prompt to auto-generate the description.

- **`listStoreProducts` (Query)**
  - **Usage:** Products Page (`/products`).
  - **Input:** `{ storeId: string, search?: string, filter?: string }`
  - **Action:** Retrieves all products belonging to a specific store.

- **`listMarketplaceProducts` (Query)**
  - **Usage:** Explore Page (`/explore`).
  - **Input:** `{ category?: string, limit?: number }`
  - **Action:** Retrieves featured or trending products from across all public stores for the global marketplace.

- **`updateProduct` & `deleteProduct` (Mutations)**
  - **Usage:** Products Page.
  - **Action:** Modifies stock, price, or removes a product.

## 3. Order Operations (`orderRouter`)

Handles transactions and fulfillment statuses.

- **`listStoreOrders` (Query)**
  - **Usage:** Orders Page (`/orders`) & Analytics Page (`RecentOrders`).
  - **Input:** `{ storeId: string, status?: 'New' | 'Dispatched' | 'Delivered', dateRange?: string }`
  - **Action:** Fetches orders placed at a specific store.

- **`updateOrderStatus` (Mutation)**
  - **Usage:** Orders Page.
  - **Input:** `{ orderId: string, status: 'Processing' | 'Shipped' | 'Delivered' | 'Refunded' }`
  - **Action:** Updates the fulfillment status of an order.

## 4. Coupon Operations (`couponRouter`)

Manages promotional discounts.

- **`createCoupon` (Mutation)**
  - **Usage:** Coupons Page (`/coupons`).
  - **Input:** `{ storeId: string, code: string, discountAmount: number, discountType: 'percentage' | 'fixed', maxUses: number, expiryDate?: Date }`
  - **Action:** Generates a new promotional code.

- **`listCoupons` (Query)**
  - **Usage:** Coupons Page.
  - **Input:** `{ storeId: string }`
  - **Action:** Lists all active and expired coupons for a store, including usage metrics.

- **`deleteCoupon` (Mutation)**
  - **Usage:** Coupons Page.
  - **Action:** Deactivates or deletes an expired coupon.

## 5. Analytics Operations (`analyticsRouter`)

Aggregates store performance data.

- **`getStoreMetrics` (Query)**
  - **Usage:** Analytics Page (`MetricCards`).
  - **Input:** `{ storeId: string, dateRange: '7D' | '30D' | '90D' }`
  - **Action:** Calculates Total Revenue, Total Orders, Average Order Value, and Conversion Rate, including percentage changes vs. the previous period.

- **`getRevenueChartData` (Query)**
  - **Usage:** Analytics Page (`RevenueChart`).
  - **Input:** `{ storeId: string, dateRange: '7D' | '30D' | '90D' }`
  - **Action:** Returns time-series data points (dates and revenue amounts) to populate the visual chart.

- **`getTopPerformer` (Query)**
  - **Usage:** Analytics Page (`TopPerformer`).
  - **Input:** `{ storeId: string, dateRange: string }`
  - **Action:** Identifies the best-selling product within the given timeframe.

## 6. AI Assistant Operations (`aiRouter`)

Handles conversational interactions in the Chat module.

- **`sendMessage` (Mutation)**
  - **Usage:** Chat Page (`/chat`).
  - **Input:** `{ storeId: string, message: string }`
  - **Action:** Sends a prompt to the AI Assistant. The AI can then execute tools (like generating a product, querying analytics, or applying a Stitch design system) and return a response.
