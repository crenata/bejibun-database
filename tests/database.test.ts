import {describe, expect, test} from "bun:test";
import DatabaseConfig from "../src/config/database";
import DatabaseBuilder from "../src/builders/DatabaseBuilder";
import Database from "../src/facades/Database";
import {latestCounter, nextFileName, resolveTemplate} from "../src/commands/make/MakeHelper";

describe("Database facade", () => {
    test("knex returns a configured Knex instance", () => {
        const database = Database.knex();

        expect(database).toBeDefined();
        expect(typeof database.raw).toBe("function");
    });

    test("knex returns the same cached instance across calls", () => {
        const a = Database.knex();
        const b = Database.knex();

        expect(a).toBe(b);
    });

    test("reset destroys the pool and the next call creates a fresh instance", async () => {
        const a = Database.knex();
        await Database.reset();

        const b = Database.knex();

        expect(b).not.toBe(a);

        await Database.reset();
    });

    test("reset is safe when no instance has been created", async () => {
        await Database.reset();

        expect(Database.knex()).toBeDefined();

        await Database.reset();
    });
});

describe("DatabaseBuilder", () => {
    test("config resolves the default config when no user config exists", () => {
        const builder = new DatabaseBuilder();
        const config = (builder as any).config();

        expect(config.client).toBe(DatabaseConfig.client);
        expect(config.connection.database).toBe("bejibun");
    });

    test("config is cached across builder instances", () => {
        const a = (new DatabaseBuilder() as any).config();
        const b = (new DatabaseBuilder() as any).config();

        expect(a).toBe(b);
    });

    test("knex is cached across builder instances", () => {
        const a = new DatabaseBuilder().knex();
        const b = new DatabaseBuilder().knex();

        expect(a).toBe(b);
    });

    test("knex returns a fresh instance after reset", async () => {
        const builder = new DatabaseBuilder();
        const a = builder.knex();
        await builder.reset();

        const b = builder.knex();

        expect(b).not.toBe(a);
    });
});

describe("MakeHelper", () => {
    test("nextFileName formats the artifact path", () => {
        const name = nextFileName("migrations", "20260101", 3, "users");

        expect(name).toBe("migrations/20260101_000004_users.ts");
    });

    test("latestCounter returns 0 when the directory holds no matching files", () => {
        expect(latestCounter("20260101", "missing")).toBe(0);
    });

    test("resolveTemplate points to an existing file for both types", async () => {
        const migration = resolveTemplate("src/commands/make", "migrations");
        const seeder = resolveTemplate("src/commands/make", "seeders");

        expect(await migration.exists()).toBe(true);
        expect(await seeder.exists()).toBe(true);
    });
});