import DatabaseBuilder from "../builders/DatabaseBuilder";
export default class Database {
    static knex() {
        return new DatabaseBuilder().knex();
    }
}
