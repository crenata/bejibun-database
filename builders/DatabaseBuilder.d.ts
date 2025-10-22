import type { Knex } from "knex";
export default class DatabaseBuilder {
    protected database?: Knex;
    knex(): Knex;
}
