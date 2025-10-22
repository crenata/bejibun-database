import Logger from "@bejibun/logger";
import Chalk from "@bejibun/logger/facades/Chalk";
import {ask, isNotEmpty} from "@bejibun/utils";
import ora from "ora";
import Database from "@/facades/Database";

export default class MigrateRollbackCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    protected $signature: string = "migrate:rollback";

    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string = "Rollback the latest migrations";

    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    protected $options: Array<Array<any>> = [
        ["-f, --force", "Skip command confirmation"]
    ];

    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<string>>
     */
    protected $arguments: Array<Array<string>> = [];

    public async handle(options: any, args: Array<string>): Promise<void> {
        const database = Database.knex();

        const bypass = isNotEmpty(options.force);

        let confirm = "Y";
        if (!bypass) confirm = await ask(
            Chalk.setValue("This will ROLLBACK latest migrations. Are you want to continue? (Y/N): ")
                .inline()
                .error()
                .show()
        );

        if (confirm.toUpperCase() === "Y") {
            if (!bypass) Logger.empty();

            const spinner = ora(
                Chalk.setValue("Rollback...")
                    .info()
                    .show()
            ).start();
            try {
                const [batchNo, logs] = await database.migrate.rollback();
                spinner.succeed(`Batch ${batchNo} finished`);

                if (logs.length > 0) logs.forEach((migration: string) => spinner.succeed(migration));
                else spinner.succeed("No migrations were rolled back.");
            } catch (error: any) {
                spinner.fail(`Rollback failed : ${error.message}`);
            } finally {
                await database.destroy();
                spinner.stop();
            }
        }
    }
}