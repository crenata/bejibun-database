import type {Knex} from "knex";
import DatabaseBuilder from "@/builders/DatabaseBuilder";

/** Cached builder instance so the config and connection pool are reused. */
let builder: DatabaseBuilder | null = null;

/**
 * Static facade exposing the Knex database connection.
 */
export default class Database {
    /**
     * Returns a cached Knex instance, creating it on first use.
     *
     * @returns {Knex} The configured Knex database instance.
     */
    public static knex(): Knex {
        if (!builder) builder = new DatabaseBuilder();

        return builder.knex();
    }

    /**
     * Destroys the cached connection pool so the next call creates a fresh instance.
     *
     * @returns {Promise<void>} Resolves once the connection pool is closed.
     */
    public static async reset(): Promise<void> {
        if (builder) {
            await builder.reset();

            builder = null;
        }
    }
}
