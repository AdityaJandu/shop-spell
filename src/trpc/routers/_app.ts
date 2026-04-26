import { createTRPCRouter } from '../init';
import { storeRouter } from './store.router';
import { productRouter } from './product.router';
import { orderRouter } from './order.router';
import { couponRouter } from './coupon.router';
import { analyticsRouter } from './analytics.router';
import { aiRouter } from './ai.router';

export const appRouter = createTRPCRouter({
    store: storeRouter,
    product: productRouter,
    order: orderRouter,
    coupon: couponRouter,
    analytics: analyticsRouter,
    ai: aiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;