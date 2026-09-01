import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import path from "path";

/**
 * Copies the package's default config files into the project's config directory.
 */
const configPath: string = path.resolve(__dirname, "config");
/** Matches JavaScript and TypeScript file extensions. */
const regex: RegExp = /\.(m?js|ts)$/;

/** Config files found in the package's config directory. */
const configs: Array<string> = Array.from(
    new Bun.Glob("**/*").scanSync({
        cwd: configPath
    })
).filter((value) => regex.test(value) && !value.endsWith(".d.ts"));

for (const config of configs) {
    const destination = config.replace(regex, ".ts");

    await Bun.write(
        App.Path.configPath(destination),
        await Bun.file(path.resolve(configPath, config)).text()
    );

    Logger.setContext("CONFIGURE").info(`Copying ${config} into config/${destination}`);
}
