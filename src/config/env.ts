import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const DEFAULT_LANG: AppLanguage = "en";
export const LANGS: [AppLanguage, ...Array<AppLanguage>] = [
    DEFAULT_LANG,
] as const;

export const env = createEnv({
    isServer: true,
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
    server: {
        // server
        NODE_ENV: z.enum(["development", "production"]),
        HOST: z.string().min(1).optional().default("127.0.0.1"),
        PORT: z.coerce.number().optional().default(42069),
        LANG: z.enum(LANGS).default("en"),
        GITHUB_CLIENT_ID: z.string().min(1),
        GITHUB_CLIENT_SECRET: z.string().min(1),

        // database
        DATABASE_URL: z.string().min(1),
        DATABASE_AUTH_TOKEN: z.string().min(1).optional(),
        DATABASE_SYNC_URL: z.string().min(1).optional(),

        // logging
        LOG_LEVEL: z
            .enum(["fatal", "error", "warn", "info", "debug", "trace"])
            .optional()
            .default("trace"),
    },
});

export const IS_PRODUCTION = env.NODE_ENV === "production";

export type AppLanguage = "en";
export type Env = typeof env;
