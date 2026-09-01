/** Console command that creates a new migration file. */
export default class MakeMigrationCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    protected $signature: string;
    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string;
    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    protected $options: Array<Array<any>>;
    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<string>>
     */
    protected $arguments: Array<Array<string>>;
    /**
     * Handles the migration creation command.
     *
     * @param {any} options - Command options.
     * @param {string} args - The migration filename.
     */
    handle(options: any, args: string): Promise<void>;
}
