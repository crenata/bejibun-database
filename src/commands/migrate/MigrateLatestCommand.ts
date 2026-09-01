import chalk from "chalk";
import ora from "ora";
import Database from "@/facades/Database";

/** Console command that runs the latest migration. */
export default class MigrateLatestCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    protected $signature: string = "migrate:latest";

    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string = "Run latest migration";

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
    protected $arguments: Array<Array<string>> = [];

    /** Executes the latest migration. */
    public async handle(): Promise<void> {
        const database = Database.knex();

        const spinner = ora(chalk.blueBright("Migrating...")).start();

        try {
            const [batchNo, logs] = await database.migrate.latest();
            spinner.succeed(`Batch ${batchNo} finished`);

            if (logs.length > 0) logs.forEach((migration: string) => spinner.succeed(migration));
            else spinner.succeed("No migrations were run.");
        } catch (error: any) {
            spinner.fail(`Migration failed : ${error.message}`);
        } finally {
            await Database.reset();
            spinner.stop();
        }
    }
}
