import type {Knex} from "knex";
import App from "@bejibun/app";
import fs from "fs";
import knex from "knex";
import DatabaseConfig from "@/config/database";

export default class DatabaseBuilder {
    protected database?: Knex;

    public knex(): Knex {
        const configPath = App.Path.configPath("database.ts");

        let config: any;

        if (fs.existsSync(configPath)) config = require(configPath).default;
        else config = DatabaseConfig;

        this.database = knex(config);

        return this.database;
    }
}