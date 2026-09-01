import type { Knex } from "knex";
/**
 * Creates the "tests" table.
 *
 * @param {Knex} knex - The Knex instance used to run the migration.
 * @returns {Knex.SchemaBuilder} The schema builder for the migration.
 */
export declare function up(knex: Knex): Knex.SchemaBuilder;
/**
 * Drops the "tests" table.
 *
 * @param {Knex} knex - The Knex instance used to run the migration.
 * @returns {Knex.SchemaBuilder} The schema builder for the migration.
 */
export declare function down(knex: Knex): Knex.SchemaBuilder;
