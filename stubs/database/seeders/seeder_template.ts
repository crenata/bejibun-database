/**
 * Inserts sample data into the database.
 *
 * @param {any} knex - The Knex instance used to run the seeder.
 */
export async function seed(knex: any): Promise<void> {
    // @ts-expect-error for sample purposes
    await TestModel.query(knex).insert({
        name: "Sample"
    });
}
