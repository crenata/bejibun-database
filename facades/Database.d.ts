import type { Knex } from "knex";
/**
 * Static facade exposing the Knex database connection.
 */
export default class Database {
    /**
     * Returns a cached Knex instance, creating it on first use.
     *
     * @returns {Knex} The configured Knex database instance.
     */
    static knex(): Knex;
    /**
     * Destroys the cached connection pool so the next call creates a fresh instance.
     *
     * @returns {Promise<void>} Resolves once the connection pool is closed.
     */
    static reset(): Promise<void>;
}
