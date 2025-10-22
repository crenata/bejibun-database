import Chalk from "@bejibun/logger/facades/Chalk";
import ora from "ora";
import path from "path";
import Database from "@/facades/Database";

export default class DbSeedCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    protected $signature: string = "db:seed";

    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string = "Run database seeders";

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

    public async handle(options: any, args: Array<string>): Promise<void> {
        const database = Database.knex();

        const spinner = ora(
            Chalk.setValue("Seeding...")
                .info()
                .show()
        ).start();

        try {
            const logs = (await database.seed.run()).flat();
            spinner.succeed("Seeding finished");

            if (logs.length > 0) logs.forEach((seeder: string) => spinner.succeed(path.basename(seeder)));
            else spinner.succeed("No seeders were run.");
        } catch (error: any) {
            spinner.fail(`Seeding failed : ${error.message}`);
        } finally {
            await database.destroy();
            spinner.stop();
        }
    }
}