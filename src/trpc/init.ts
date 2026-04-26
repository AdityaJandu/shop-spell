import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { db } from '@/db';
import { auth } from '@/lib/auth';

// ─── Context ──────────────────────────────────────────────────────────────────

/**
 * This context creator accepts `headers` so it can be reused in both
 * the RSC server caller (where you pass `next/headers`) and the
 * API route handler (where you pass the request headers).
 *
 * It resolves the current user session via BetterAuth's `getSession`.
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
    const session = await auth.api.getSession({
        headers: opts.headers,
    });

    return {
        db,
        user: session?.user ?? null,
        session: session?.session ?? null,
    };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// ─── tRPC Init ────────────────────────────────────────────────────────────────

const t = initTRPC
    .context<Context>()
    .create({
        /**
         * @see https://trpc.io/docs/server/data-transformers
         */
        transformer: superjson,
        errorFormatter({ shape, error }) {
            return {
                ...shape,
                data: {
                    ...shape.data,
                    zodError:
                        error.cause instanceof ZodError ? error.cause.flatten() : null,
                },
            };
        },
    });

// ─── Middleware ───────────────────────────────────────────────────────────────

const isAuthenticated = t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be signed in to perform this action.',
        });
    }
    // Narrow ctx.user to non-null for downstream procedures
    return next({ ctx: { ...ctx, user: ctx.user } });
});

// ─── Exported Builders ────────────────────────────────────────────────────────

// Base router and caller factory
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

// Public procedure — anyone can call, no auth required
export const publicProcedure = t.procedure;

// Alias for backward compatibility
export const baseProcedure = t.procedure;

// Protected procedure — requires authenticated user (uses getSession)
export const protectedProcedure = t.procedure.use(isAuthenticated);