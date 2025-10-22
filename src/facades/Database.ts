import type {Knex} from "knex";
import DatabaseBuilder from "@/builders/DatabaseBuilder";

export default class Database {
    public static knex(): Knex {
        return new DatabaseBuilder().knex();
    }
}