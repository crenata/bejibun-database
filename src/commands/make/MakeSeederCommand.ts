import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import {defineValue, isEmpty} from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import path from "path";

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
    protected $arguments: Array<Array<string>> = [
        ["<file>", "The name of the seeder file"]
    ];

    public async handle(options: any, args: string): Promise<void> {
        if (isEmpty(args)) {
            Logger.setContext("APP").error("There is no filename provided.");
            return;
        }

        const file: string = args;
        const seedersDirectory: string = "seeders";
        const seedersPath: string = path.resolve(__dirname, `../../stubs/database/${seedersDirectory}`);

        const seeders: Array<string> = Array.from(
            new Bun.Glob("**/*").scanSync({
                cwd: seedersPath
            })
        ).filter(value => (
            /\.ts$/.test(value) &&
            !value.endsWith(".d.ts")
        ));

        const template = seeders.find(value => value.includes("seeder_template"));

        if (isEmpty(template)) {
            Logger.setContext("APP").error("Whoops, something went wrong, the seeder template not found.");
            return;
        }

        const now: string = Luxon.datetime.now().toFormat("yyyyMMdd");
        const latest: string | undefined = Array.from(
            new Bun.Glob("**/*").scanSync({
                cwd: App.Path.databasePath(seedersDirectory)
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

        const destination: string = `${seedersDirectory}/${now}_${String(counter + 1).padStart(6, "0")}_${file}.ts`;

        await Bun.write(App.Path.databasePath(destination), await Bun.file(path.resolve(seedersPath, template as string)).text());

        Logger.setContext("APP").info(`Seeder [database/${destination}] created successfully.`);
    }
}