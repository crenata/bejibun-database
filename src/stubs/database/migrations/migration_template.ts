import type {Knex} from "knex";

/**
 * Creates the "tests" table.
 *
 * @param {Knex} knex - The Knex instance used to run the migration.
 * @returns {Knex.SchemaBuilder} The schema builder for the migration.
 */
export function up(knex: Knex): Knex.SchemaBuilder {
    return knex.schema.createTable("tests", (table: Knex.TableBuilder) => {
        table.bigIncrements("id");
        table.timestamps(true, true);
        table.timestamp("deleted_at");
    });
}

/**
 * Drops the "tests" table.
 *
 * @param {Knex} knex - The Knex instance used to run the migration.
 * @returns {Knex.SchemaBuilder} The schema builder for the migration.
 */
export function down(knex: Knex): Knex.SchemaBuilder {
    return knex.schema.dropTable("tests");
}
