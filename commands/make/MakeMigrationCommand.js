import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import { defineValue, isEmpty } from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import path from "path";
export default class MakeMigrationCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "make:migration";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Create a new migration file";
    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    $options = [];
    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<string>>
     */
    $arguments = [
        ["<file>", "The name of the migration file"]
    ];
    async handle(options, args) {
        if (isEmpty(args)) {
            Logger.setContext("APP").error("There is no filename provided.");
            return;
        }
        const file = args;
        const migrationsDirectory = "migrations";
        const template = Bun.file(path.resolve(__dirname, `../../stubs/database/${migrationsDirectory}/migration_template.ts`));
        if (!await template.exists()) {
            Logger.setContext("APP").error("Whoops, something went wrong, the migration template not found.");
            return;
        }
        const now = Luxon.datetime.now().toFormat("yyyyMMdd");
        const latest = Array.from(new Bun.Glob("**/*").scanSync({
            cwd: App.Path.databasePath(migrationsDirectory)
        })).map((value) => {
            const split = value.split("_").slice(0, 2);
            return {
                date: split[0],
                count: split[1]
            };
        }).filter((value) => {
            return value.date === now;
        }).map((value) => value.count).sort().reverse()[0];
        const counter = defineValue(parseInt(latest), 0);
        const destination = `${migrationsDirectory}/${now}_${String(counter + 1).padStart(6, "0")}_${file}.ts`;
        await Bun.write(App.Path.databasePath(destination), await template.text());
        Logger.setContext("APP").info(`Migration [database/${destination}] created successfully.`);
    }
}
