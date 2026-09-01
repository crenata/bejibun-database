import Logger from "@bejibun/logger";
import { ask, isNotEmpty } from "@bejibun/utils";
import chalk from "chalk";
import ora from "ora";
import Database from "../../facades/Database";
/** Console command that drops all tables and re-runs migrations. */
export default class MigrateFreshCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "migrate:fresh";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Rollback all migrations and re-run migrations";
    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    $options = [["-f, --force", "Skip command confirmation"]];
    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<string>>
     */
    $arguments = [];
    /**
     * Executes the migrate fresh command.
     *
     * @param {any} options - Command options.
     */
    async handle(options) {
        const database = Database.knex();
        const bypass = isNotEmpty(options.force);
        let confirm = "Y";
        if (!bypass)
            confirm = await ask(chalk.red("This will DROP ALL tables and re-run ALL migrations. Are you want to continue? (Y/N): "));
        if (confirm.toUpperCase() === "Y") {
            if (!bypass)
                Logger.empty();
            const spinner = ora(chalk.blueBright("Rollback...")).start();
            try {
                await database.migrate.rollback({}, true);
                spinner.succeed("Rolled back all migrations");
                const [batchNo, logs] = await database.migrate.latest();
                spinner.succeed(`Batch ${batchNo} finished`);
                if (logs.length > 0)
                    logs.forEach((migration) => spinner.succeed(migration));
                else
                    spinner.succeed("No migrations were run.");
            }
            catch (error) {
                spinner.fail(`Migration failed : ${error.message}`);
            }
            finally {
                await Database.reset();
                spinner.stop();
            }
        }
    }
}
