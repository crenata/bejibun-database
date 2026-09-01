import { ask, defineValue, isNotEmpty } from "@bejibun/utils";
import chalk from "chalk";
import ora from "ora";
import path from "path";
import Database from "../../facades/Database";
/** Console command that runs database seeders. */
export default class DbSeedCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "db:seed";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Run database seeders";
    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    $options = [
        ["-f, --force", "Skip command confirmation"],
        ["-s, --seeder <file>", "Specific file seeder"]
    ];
    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<string>>
     */
    $arguments = [];
    /**
     * Executes the database seed command.
     *
     * @param {any} options - Command options.
     */
    async handle(options) {
        const database = Database.knex();
        const environment = defineValue(Bun.env.APP_ENV, "development");
        const bypass = isNotEmpty(options.force);
        const seeder = options.seeder;
        let confirm = "Y";
        if (environment === "production" && !bypass)
            confirm = await ask(chalk.red("Application in production. Are you sure you want to run this command? (Y/N): "));
        if (confirm.toUpperCase() === "Y") {
            const spinner = ora(chalk.blueBright("Seeding...")).start();
            try {
                const logs = (await database.seed.run({
                    specific: seeder
                })).flat();
                spinner.succeed("Seeding finished");
                if (logs.length > 0)
                    logs.forEach((seeder) => spinner.succeed(path.basename(seeder)));
                else
                    spinner.succeed("No seeders were run.");
            }
            catch (error) {
                spinner.fail(`Seeding failed : ${error.message}`);
            }
            finally {
                await Database.reset();
                spinner.stop();
            }
        }
    }
}
