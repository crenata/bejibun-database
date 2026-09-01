/**
 * Default Knex configuration for the PostgreSQL database.
 */
const config = {
    /** Database client to use. */
    client: "pg",
    /** Connection settings for the PostgreSQL server. */
    connection: {
        host: "127.0.0.1",
        port: 5432,
        user: "postgres",
        password: "",
        database: "bejibun"
    },
    /** Migration settings. */
    migrations: {
        extension: "ts",
        directory: "./database/migrations",
        tableName: "migrations"
    },
    /** Connection pool settings. */
    pool: {
        min: 0,
        max: 1
    },
    /** Seeder settings. */
    seeds: {
        extension: "ts",
        directory: "./database/seeders"
    }
};
export default config;
