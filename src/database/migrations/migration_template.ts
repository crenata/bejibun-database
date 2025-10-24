import type {Knex} from "knex";

export function up(knex: Knex): Knex.SchemaBuilder {
    return knex.schema.createTable("tests", (table: Knex.TableBuilder) => {
        table.bigIncrements("id");
        table.timestamps(true, true);
        table.timestamp("deleted_at");
    });
}

export function down(knex: Knex): Knex.SchemaBuilder {
    return knex.schema.dropTable("tests");
}