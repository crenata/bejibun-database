import App from "@bejibun/app";
import {resolve} from "path";

/** Type of generated file template. */
export type TemplateType = "migrations" | "seeders";

/**
 * Resolves the stub template file for the given artifact type.
 *
 * @param {string} moduleDir - The calling command's directory.
 * @param {TemplateType} type - Artifact type to resolve a template for.
 * @returns {Bun.BunFile} The resolved template file.
 */
export function resolveTemplate(moduleDir: string, type: TemplateType): Bun.BunFile {
    const template = type === "migrations" ? "migration_template.ts" : "seeder_template.ts";

    return Bun.file(resolve(moduleDir, `../../stubs/database/${type}/${template}`));
}

/**
 * Scans the artifact directory and returns the highest existing counter for the given date.
 *
 * @param {string} date - The date prefix (yyyyMMdd) to match.
 * @param {string} directory - The artifact directory name.
 * @returns {number} The highest counter found, or 0 when none match.
 */
export function latestCounter(date: string, directory: string): number {
    let max = 0;

    try {
        const scan = new Bun.Glob("**/*").scanSync({
            cwd: App.Path.databasePath(directory)
        });

        for (const file of scan) {
            const [fileDate, count] = file.split("_");
            if (fileDate === date && count) {
                const n = parseInt(count, 10);

                if (n > max) max = n;
            }
        }

        return max;
    } catch {
        return 0;
    }
}

/**
 * Builds the destination filename for a new artifact.
 *
 * @param {string} directory - The artifact directory name.
 * @param {string} date - The date prefix (yyyyMMdd).
 * @param {number} counter - The highest existing counter.
 * @param {string} file - The user-provided artifact name.
 * @returns {string} The artifact destination path.
 */
export function nextFileName(
    directory: string,
    date: string,
    counter: number,
    file: string
): string {
    return `${directory}/${date}_${String(counter + 1).padStart(6, "0")}_${file}.ts`;
}
