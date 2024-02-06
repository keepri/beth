import { spawn, spawnSync, build, file, write, env } from "bun";

const PACKAGE_JSON = file("./package.json");
const DOT_ENV = file("./.env.local");
const NODE_ENV = env["NODE_ENV"] || "development";

const isProduction = NODE_ENV === "production";
const mv = isProduction ? "mv" : "cp";

const packageJson = JSON.parse(await PACKAGE_JSON.text());
const dependencies = Object.keys(packageJson.dependencies);

await build({
    root: "./",
    entrypoints: ["./main.ts"],
    outdir: "./dist",
    splitting: true,
    minify: true,
    plugins: [],
    external: dependencies,
});

await write(file("./dist/package.json"), await PACKAGE_JSON.arrayBuffer());
await write(file("./dist/.env"), await DOT_ENV.arrayBuffer());

spawnSync(["bun", "tw"]);
spawn({ cmd: [mv, "-r", "./static", "./dist/static"] });
spawn(["bun", "install"], { cwd: "./dist" });