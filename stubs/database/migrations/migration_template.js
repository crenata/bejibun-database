export function up(knex) {
    return knex.schema.createTable("tests", (table) => {
        table.bigIncrements("id");
        table.timestamps(true, true);
        table.timestamp("deleted_at");
    });
}
export function down(knex) {
    return knex.schema.dropTable("tests");
}
