import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import {defineValue, isEmpty} from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import path from "path";

export default class MakeMigrationCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    protected $signature: string = "make:migration";

    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string = "Create a new migration file";

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
    protected $arguments: Array<Array<string>> = [
        ["<file>", "The name of the migration file"]
    ];

    public async handle(options: any, args: string): Promise<void> {
        if (isEmpty(args)) {
            Logger.setContext("APP").error("There is no filename provided.");
            return;
        }

        const file: string = args;
        const migrationsDirectory: string = "migrations";
        const template: Bun.BunFile = Bun.file(path.resolve(__dirname, `../../stubs/database/${migrationsDirectory}/migration_template.ts`));

        if (!await template.exists()) {
            Logger.setContext("APP").error("Whoops, something went wrong, the migration template not found.");
            return;
        }

        const now: string = Luxon.datetime.now().toFormat("yyyyMMdd");
        const latest: string | undefined = Array.from(
            new Bun.Glob("**/*").scanSync({
                cwd: App.Path.databasePath(migrationsDirectory)
            })
        ).map((value: string) => {
            const split = value.split("_").slice(0, 2);

            return {
                date: split[0],
                count: split[1]
            };
        }).filter((value: Record<string, string>) => {
            return value.date === now;
        }).map((value: Record<string, string>) => value.count).sort().reverse()[0];

        const counter: number = defineValue(parseInt(latest), 0);

        const destination: string = `${migrationsDirectory}/${now}_${String(counter + 1).padStart(6, "0")}_${file}.ts`;

        await Bun.write(App.Path.databasePath(destination), await template.text());

        Logger.setContext("APP").info(`Migration [database/${destination}] created successfully.`);
    }
}