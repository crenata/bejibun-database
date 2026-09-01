const realLog = console.log;
console.log = () => {};

const t0 = performance.now();
const {default: Database} = await import("../../index.js");
Database.knex();

const t1 = performance.now();
console.log = realLog;
process.stderr.write(String(t1 - t0));
