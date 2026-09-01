import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import {isEmpty} from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import {latestCounter, nextFileName, resolveTemplate} from "@/commands/make/MakeHelper";

/** Console command that creates a new seeder file. */
export default class MakeSeederCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    protected $signature: string = "make:seeder";

    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string = "Create a new seeder file";

    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    protected $options: Array<Array<any>> = [];

    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<string>>
     */
    protected $arguments: Array<Array<string>> = [["<file>", "The name of the seeder file"]];

    /**
     * Handles the seeder creation command.
     *
     * @param {any} options - Command options.
     * @param {string} args - The seeder filename.
     */
    public async handle(options: any, args: string): Promise<void> {
        if (isEmpty(args)) {
            Logger.setContext("APP").error("There is no filename provided.");
            return;
        }

        const file: string = args;
        const seedersDirectory = "seeders";
        const template: Bun.BunFile = resolveTemplate(__dirname, seedersDirectory);

        if (!(await template.exists())) {
            Logger.setContext("APP").error(
                "Whoops, something went wrong, the seeder template not found."
            );
            return;
        }

        const now: string = Luxon.DateTime.now().toFormat("yyyyMMdd");
        const destination: string = nextFileName(
            seedersDirectory,
            now,
            latestCounter(now, seedersDirectory),
            file
        );

        await Bun.write(App.Path.databasePath(destination), await template.text());

        Logger.setContext("APP").info(`Seeder [database/${destination}] created successfully.`);
    }
}
