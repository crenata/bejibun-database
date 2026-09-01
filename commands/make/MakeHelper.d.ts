/** Type of generated file template. */
export type TemplateType = "migrations" | "seeders";
/**
 * Resolves the stub template file for the given artifact type.
 *
 * @param {string} moduleDir - The calling command's directory.
 * @param {TemplateType} type - Artifact type to resolve a template for.
 * @returns {Bun.BunFile} The resolved template file.
 */
export declare function resolveTemplate(moduleDir: string, type: TemplateType): Bun.BunFile;
/**
 * Scans the artifact directory and returns the highest existing counter for the given date.
 *
 * @param {string} date - The date prefix (yyyyMMdd) to match.
 * @param {string} directory - The artifact directory name.
 * @returns {number} The highest counter found, or 0 when none match.
 */
export declare function latestCounter(date: string, directory: string): number;
/**
 * Builds the destination filename for a new artifact.
 *
 * @param {string} directory - The artifact directory name.
 * @param {string} date - The date prefix (yyyyMMdd).
 * @param {number} counter - The highest existing counter.
 * @param {string} file - The user-provided artifact name.
 * @returns {string} The artifact destination path.
 */
export declare function nextFileName(directory: string, date: string, counter: number, file: string): string;
