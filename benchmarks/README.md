# Benchmarks

Speed comparison: baseline (previously published npm release) vs the optimized `@bejibun/database` in this repo.

## Running

```bash
# Run all benchmarks (installs baseline from npm first)
bun run bench

# Or run individually (after install-deps)
bun run install-deps
bun run coldstart
bun run throughput
```

## Cold Start

Measures import time by spawning fresh OS processes. Two metrics:

- **Full process time** — spawn → exit (includes Bun boot time)
- **Import + first init** — measured inside the process, isolates the package's own cost

<!-- BENCHMARK:COLDSTART:START -->

|                             | baseline | optimized | speedup   |
| --------------------------- | -------- | --------- | --------- |
| Full process (spawn → exit) | 74.8ms   | 74.4ms    | **1.00x** |
| Import → first init         | 65.9ms   | 65.1ms    | **1.01x** |

<!-- BENCHMARK:COLDSTART:END -->

## Throughput

Raw call speed for `Database.knex()` — the hot path invoked per request. 20,000 iterations, output silenced.

<!-- BENCHMARK:THROUGHPUT:START -->

| Method            | baseline (0.1.21) | optimized | speedup      | baseline ops/s | optimized ops/s |
| ----------------- | ----------------- | --------- | ------------ | -------------- | --------------- |
| `Database.knex()` | 451.5ms           | 0.4ms     | **1128.89x** | 44,294/s       | 50,003,375/s    |

<!-- BENCHMARK:THROUGHPUT:END -->
