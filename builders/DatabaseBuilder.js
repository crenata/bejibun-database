import App from "@bejibun/app";
import fs from "fs";
import knex from "knex";
import DatabaseConfig from "../config/database";
export default class DatabaseBuilder {
    database;
    knex() {
        const configPath = App.Path.configPath("database.ts");
        let config;
        if (fs.existsSync(configPath))
            config = require(configPath).default;
        else
            config = DatabaseConfig;
        this.database = knex(config);
        return this.database;
    }
}
