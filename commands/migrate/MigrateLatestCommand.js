import chalk from "chalk";
import ora from "ora";
import Database from "../../facades/Database";
/** Console command that runs the latest migration. */
export default class MigrateLatestCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "migrate:latest";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Run latest migration";
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
    $arguments = [];
    /** Executes the latest migration. */
    async handle() {
        const database = Database.knex();
        const spinner = ora(chalk.blueBright("Migrating...")).start();
        try {
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
