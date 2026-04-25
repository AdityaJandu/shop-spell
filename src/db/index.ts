import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in environment variables");
}

const client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
});
export const db = drizzle(client);