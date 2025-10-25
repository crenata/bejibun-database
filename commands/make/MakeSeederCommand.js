import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import { defineValue, isEmpty } from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import path from "path";
export default class MakeSeederCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "make:seeder";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Create a new seeder file";
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
    $arguments = [
        ["<file>", "The name of the seeder file"]
    ];
    async handle(options, args) {
        if (isEmpty(args)) {
            Logger.setContext("APP").error("There is no filename provided.");
            return;
        }
        const file = args;
        const seedersDirectory = "seeders";
        const seedersPath = path.resolve(__dirname, `../../database/${seedersDirectory}`);
        const seeders = Array.from(new Bun.Glob("**/*").scanSync({
            cwd: seedersPath
        })).filter(value => (/\.(m?js|ts)$/.test(value) &&
            !value.endsWith(".d.ts")));
        const template = seeders.find(value => value.includes("seeder_template"));
        if (isEmpty(template)) {
            Logger.setContext("APP").error("Whoops, something went wrong, the seeder template not found.");
            return;
        }
        const now = Luxon.datetime.now().toFormat("yyyyMMdd");
        const latest = Array.from(new Bun.Glob("**/*").scanSync({
            cwd: App.Path.databasePath(seedersDirectory)
        })).map((value) => {
            const split = value.split("_").slice(0, 2);
            return {
                date: split[0],
                count: split[1]
            };
        }).filter((value) => {
            return value.date === now;
        }).map((value) => value.count).sort().reverse()[0];
        const counter = defineValue(parseInt(latest), 0);
        const destination = `${seedersDirectory}/${now}_${String(counter + 1).padStart(6, "0")}_${file}.ts`;
        await Bun.write(App.Path.databasePath(destination), await Bun.file(path.resolve(seedersPath, template)).text());
        Logger.setContext("APP").info(`Seeder [database/${destination}] created successfully.`);
    }
}
