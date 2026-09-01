import App from "@bejibun/app";
import knex from "knex";
/** Lazily loaded database config, shared across instances. */
let cachedConfig;
/** Lazily created Knex instance, reused until reset. */
let cachedKnex = null;
/**
 * Builds a Knex instance from the user's config file or the default config.
 *
 * The config file is read and the connection pool is created only once; subsequent
 * calls reuse the cached instance until reset.
 */
export default class DatabaseBuilder {
    /**
     * Returns a cached Knex instance, creating it from the config on first use.
     *
     * @returns {Knex} The configured Knex database instance.
     */
    knex() {
        if (cachedKnex)
            return cachedKnex;
        cachedKnex = knex(this.config());
        return cachedKnex;
    }
    /**
     * Destroys the cached connection pool so the next call creates a fresh instance.
     *
     * @returns {Promise<void>} Resolves once the connection pool is closed.
     */
    async reset() {
        if (cachedKnex) {
            await cachedKnex.destroy();
            cachedKnex = null;
        }
    }
    /**
     * Resolves the database config, loading it from the disk exactly once.
     *
     * @returns {any} The user's config or the bundled default config.
     */
    config() {
        if (cachedConfig)
            return cachedConfig;
        try {
            cachedConfig = require(App.Path.configPath("database.ts")).default;
        }
        catch {
            cachedConfig = require("../config/database").default;
        }
        return cachedConfig;
    }
}
