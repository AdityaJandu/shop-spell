import { cache } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * React cache() deduplicates this call within a single server request.
 * No matter how many server components call getSession(), the DB is hit only ONCE per request.
 */
export const getSession = cache(async () => {
    return auth.api.getSession({
        headers: await headers(),
    });
});