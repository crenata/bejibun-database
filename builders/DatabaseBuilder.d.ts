import type { Knex } from "knex";
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
    knex(): Knex;
    /**
     * Destroys the cached connection pool so the next call creates a fresh instance.
     *
     * @returns {Promise<void>} Resolves once the connection pool is closed.
     */
    reset(): Promise<void>;
    /**
     * Resolves the database config, loading it from the disk exactly once.
     *
     * @returns {any} The user's config or the bundled default config.
     */
    protected config(): any;
}
