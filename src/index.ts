import { bearer } from "@elysiajs/bearer";
import { staticPlugin } from "@elysiajs/static";
import { Elysia, type ElysiaConfig } from "elysia";

import { APP_NAME, staticDir } from "@/config";
import { initCors } from "@/config/cors";
import { IS_PRODUCTION, env } from "@/config/env";
import { initHtml } from "@/config/html";
import { initLogger } from "@/config/logger";
import { context } from "@/context";
import { cronJobs } from "@/cron";
import { errorHandler } from "@/middleware/error";
import { apiRoutes, pagesRoutes } from "@/routes";

const elysiaLogger = initLogger();
const elysiaHtml = initHtml();
const elysiaBearer = bearer();
const elysiaCors = initCors();
const elysiaStatic = staticPlugin({
    prefix: staticDir(),
    assets: "static",
});

const APP_CONFIG = {
    name: APP_NAME,
    serve: {
        hostname: env.HOST,
        port: env.PORT,
        development: !IS_PRODUCTION,
        maxRequestBodySize: 1024 * 1024 * 4, // 4mb
    },
} as const satisfies ElysiaConfig<undefined, undefined>;

const app = new Elysia(APP_CONFIG)
    .use(elysiaLogger)
    .use(elysiaHtml)
    .use(elysiaBearer)
    .use(elysiaCors)
    .use(elysiaStatic)
    .use(elysiaHtml)
    .use(context)
    .use(errorHandler)
    .use(cronJobs)
    .use(apiRoutes)
    .use(pagesRoutes)
    .onStart(function handleStart(app) {
        const server = app.server;
        if (server === null) {
            return;
        }
        const appName = app.config.name;
        const url =
            server.url.protocol + "//" + server.hostname + ":" + server.port;
        console.log(
            `🚀 ${appName} is running on ${url} in ${env.NODE_ENV} mode.`,
        );
    });

export type App = typeof app;

export function startServer() {
    app.listen({});
}
