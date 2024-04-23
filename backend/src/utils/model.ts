import supabase from "../config/db.config";
import { BadRequest, Conflict, NotFound, ServerError } from "./error";

/**
 * Loads data from a specific table based on the subject.
 * @param sub - The subject value to filter the data.
 * @param table - The name of the table to load data from.
 * @returns A promise that resolves to an object containing the loaded data, or null if no data is found.
 * @throws {ServerError} If there is an error while loading the data.
 * @throws {NotFound} If no data is found for the given subject.
 */
export async function loadData(
    sub: string,
    table: string
): Promise<object | null> {
    const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("subject", sub);

    if (error) throw new ServerError();
    if (data.length === 0) throw new NotFound("User Not Found");

    return data[0];
}

/**
 * Inserts a new record into the specified table.
 * @param table - The name of the table to insert the record into.
 * @param subject - The subject of the record.
 * @param obj - An object containing additional properties for the record.
 * @returns The result of the insert operation.
 */
export async function create(subject: string, table: string, obj: object) {
    const data = await loadData(subject, table);

    if (data) throw new Conflict("User already exists");

    const { error } = await supabase.from(table).insert([
        {
            subject: subject,
            ...obj,
        },
    ]);

    if (error) throw new ServerError();
}

/**
 * Updates the specified attributes of a record in the given table.
 * Throws an error if any of the attributes are not valid.
 *
 * @param {string} subject - The subject of the record to update.
 * @param {object} attributes - The attributes to update.
 * @param {string} table - The table to update the record in.
 * @param {string[]} validAttributes - The list of valid attributes.
 * @throws {BadRequest} If any of the attributes are not valid.
 * @throws {ServerError} If an error occurs during the update.
 */
export async function update(
    subject: string,
    attributes: object,
    table: string,
    validAttributes: string[]
) {
    for (const key in attributes) {
        const index = validAttributes.indexOf(key);
        if (index === -1) throw new BadRequest();
    }

    const { error } = await supabase
        .from(table)
        .update(attributes)
        .eq("subject", subject);

    if (error) throw new ServerError();
}
