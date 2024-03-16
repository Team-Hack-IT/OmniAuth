import supabase from "../config/db.config";
import { BadRequest, Conflict, NotFound, ServerError } from "./error";

async function loadData(sub: string, table: string): Promise<object | null> {
    const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("subject", sub);

    if (error) throw new ServerError();
    if (data.length === 0) throw new NotFound("User Not Found");

    return data[0];
}

async function create(subject: string, table: string, obj: object) {
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

async function update(
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

export { loadData, create, update };
