import Logger from "@bejibun/logger";
import { ask, isNotEmpty } from "@bejibun/utils";
import chalk from "chalk";
import ora from "ora";
import Database from "../../facades/Database";
/** Console command that rolls back the latest migrations. */
export default class MigrateRollbackCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "migrate:rollback";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Rollback the latest migrations";
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
     * Executes the rollback command.
     *
     * @param {any} options - Command options.
     */
    async handle(options) {
        const database = Database.knex();
        const bypass = isNotEmpty(options.force);
        let confirm = "Y";
        if (!bypass)
            confirm = await ask(chalk.red("This will ROLLBACK latest migrations. Are you want to continue? (Y/N): "));
        if (confirm.toUpperCase() === "Y") {
            if (!bypass)
                Logger.empty();
            const spinner = ora(chalk.blueBright("Rollback...")).start();
            try {
                const [batchNo, logs] = await database.migrate.rollback();
                spinner.succeed(`Batch ${batchNo} finished`);
                if (logs.length > 0)
                    logs.forEach((migration) => spinner.succeed(migration));
                else
                    spinner.succeed("No migrations were rolled back.");
            }
            catch (error) {
                spinner.fail(`Rollback failed : ${error.message}`);
            }
            finally {
                await Database.reset();
                spinner.stop();
            }
        }
    }
}
