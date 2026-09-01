/**
 * Throughput benchmark.
 *
 * Measures raw call speed for Database.knex() on both baseline (npm 0.1.21) and
 * optimized local version. Simulates repeated per-request invocations (the hot path
 * for database access).
 *
 * Run: bun run scripts/throughput.mjs
 */
import {printTable} from "./table-format.mjs";
import {updateReadmeSection} from "./readme-writer.mjs";

const ITERATIONS = 20_000;
const WARMUP = 500;

const {default: BaselineDatabase} = await import("@bejibun-baseline/database");
const {default: OptimizedDatabase} = await import("../../index.js");

function bench(fn) {
    for (let i = 0; i < WARMUP; i++) fn();
    const t0 = performance.now();
    for (let i = 0; i < ITERATIONS; i++) fn();
    const t1 = performance.now();
    return t1 - t0;
}

function fmt(ms) {
    return ms < 1 ? `${(ms * 1000).toFixed(0)}\u00B5s` : `${ms.toFixed(1)}ms`;
}

function sp(b, o) {
    const r = b / o;
    return r >= 1.05 ? `${r.toFixed(2)}x` : r <= 0.95 ? `${r.toFixed(2)}x` : "~1.0x";
}

function ops(ms) {
    return Math.round(ITERATIONS / (ms / 1000)).toLocaleString() + "/s";
}

const bMs = bench(() => BaselineDatabase.knex());
const oMs = bench(() => OptimizedDatabase.knex());

printTable({
    title: "THROUGHPUT BENCHMARK",
    subtitle: `${ITERATIONS.toLocaleString()} calls each, ${WARMUP.toLocaleString()} warmup calls`,
    headers: ["Method", "Baseline (0.1.21)", "Optimized", "Speedup", "Optimized ops/s"],
    rows: [{cells: ["Database.knex()", fmt(bMs), fmt(oMs), sp(bMs, oMs), ops(oMs)]}]
});

const table = [
    "| Method | baseline (0.1.21) | optimized | speedup | baseline ops/s | optimized ops/s |",
    "|---|---|---|---|---|---|",
    `| \`Database.knex()\` | ${bMs.toFixed(1)}ms | ${oMs.toFixed(1)}ms | **${(bMs / oMs).toFixed(2)}x** | ${ops(bMs)} | ${ops(oMs)} |`
].join("\n");

updateReadmeSection("THROUGHPUT", table);
