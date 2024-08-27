import { logger as elysiaLogger } from "@bogeychan/elysia-logger";
import { default as pinoPretty } from "pino-pretty";

import { env } from "@/config/env";

export function logger() {
    return elysiaLogger({
        level: env.LOG_LEVEL,
        stream: pinoPretty({
            colorize: true,
            colorizeObjects: true,
            translateTime: "SYS:standard",
            levelFirst: true,
            singleLine: true,
        }),
    });
}
