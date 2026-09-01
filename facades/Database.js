import DatabaseBuilder from "../builders/DatabaseBuilder";
/** Cached builder instance so the config and connection pool are reused. */
let builder = null;
/**
 * Static facade exposing the Knex database connection.
 */
export default class Database {
    /**
     * Returns a cached Knex instance, creating it on first use.
     *
     * @returns {Knex} The configured Knex database instance.
     */
    static knex() {
        if (!builder)
            builder = new DatabaseBuilder();
        return builder.knex();
    }
    /**
     * Destroys the cached connection pool so the next call creates a fresh instance.
     *
     * @returns {Promise<void>} Resolves once the connection pool is closed.
     */
    static async reset() {
        if (builder) {
            await builder.reset();
            builder = null;
        }
    }
}
