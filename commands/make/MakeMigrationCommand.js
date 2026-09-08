import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import { isEmpty } from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import { latestCounter, nextFileName, resolveTemplate } from "./MakeHelper";
/** Console command that creates a new migration file. */
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
    $arguments = [["<file>", "The name of the migration file"]];
    /**
     * Handles the migration creation command.
     *
     * @param {any} options - Command options.
     * @param {string} args - The migration filename.
     */
    async handle(options, args) {
        if (isEmpty(args)) {
            Logger.setContext("APP").error("There is no filename provided.");
            return;
        }
        const file = args;
        const migrationsDirectory = "migrations";
        const template = resolveTemplate(__dirname, migrationsDirectory);
        if (!(await template.exists())) {
            Logger.setContext("APP").error("Whoops, something went wrong, the migration template not found.");
            return;
        }
        const now = Luxon.DateTime.now().toFormat("yyyyMMdd");
        const destination = nextFileName(migrationsDirectory, now, latestCounter(now, migrationsDirectory), file);
        await Bun.write(App.Path.databasePath(destination), await template.text());
        Logger.setContext("APP").info(`Migration [database/${destination}] created successfully.`);
    }
}
