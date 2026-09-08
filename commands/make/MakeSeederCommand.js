import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import { isEmpty } from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import { latestCounter, nextFileName, resolveTemplate } from "./MakeHelper";
/** Console command that creates a new seeder file. */
export default class MakeSeederCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "make:seeder";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Create a new seeder file";
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
    $arguments = [["<file>", "The name of the seeder file"]];
    /**
     * Handles the seeder creation command.
     *
     * @param {any} options - Command options.
     * @param {string} args - The seeder filename.
     */
    async handle(options, args) {
        if (isEmpty(args)) {
            Logger.setContext("APP").error("There is no filename provided.");
            return;
        }
        const file = args;
        const seedersDirectory = "seeders";
        const template = resolveTemplate(__dirname, seedersDirectory);
        if (!(await template.exists())) {
            Logger.setContext("APP").error("Whoops, something went wrong, the seeder template not found.");
            return;
        }
        const now = Luxon.DateTime.now().toFormat("yyyyMMdd");
        const destination = nextFileName(seedersDirectory, now, latestCounter(now, seedersDirectory), file);
        await Bun.write(App.Path.databasePath(destination), await template.text());
        Logger.setContext("APP").info(`Seeder [database/${destination}] created successfully.`);
    }
}
