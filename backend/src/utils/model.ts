import supabase from "../config/db.config";

async function loadData(sub: string, table: string): Promise<object | null> {
    const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("subject", sub);

    if (error) throw new Error("Internal Server Error");
    if (data.length === 0) throw new Error("User Not Found");

    return data[0];
}

async function create(subject: string, table: string, obj: object) {
    const data = await loadData(subject, table);

    if (data) throw new Error("User already exists");

    const { error } = await supabase.from(table).insert([
        {
            subject: subject,
            ...obj,
        },
    ]);

    if (error) throw new Error("Internal Server Error");
}

async function update(
    subject: string,
    attributes: object,
    table: string,
    validAttributes: string[]
) {
    for (const key in attributes) {
        let index = validAttributes.indexOf(key);
        if (index === -1) throw new Error("Bad Request");
    }

    const { error } = await supabase
        .from(table)
        .update(attributes)
        .eq("subject", subject);

    if (error) throw new Error("Internal Server Error");
}

export { loadData, create, update };
