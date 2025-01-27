import { createClient } from "@libsql/client";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "@/db/schema";

import { env } from "./env";
import { log } from "./logger";
import { type CreateDrizzleClientConfig } from "./types";

export const LIBSQL_CLIENT = createClient({
    url: env.DATABASE_URL,
    syncUrl: env.DATABASE_SYNC_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
});

export const DRIZZLE_CLIENT = createDrizzleClient({
    logger: log.trace.bind(log),
});

try {
    await DRIZZLE_CLIENT.run(sql`select 6 + 9;`);
    log.info("Database connection established");
} catch (error) {
    log.error(error, "Could not establish database connection");
}

export function createDrizzleClient(config: CreateDrizzleClientConfig) {
    const client = drizzle(LIBSQL_CLIENT, {
        schema,
        logger: {
            logQuery(query, params) {
                config.logger(
                    {
                        query,
                        params,
                    },
                    "Query",
                );
            },
        },
    });

    return client;
}
