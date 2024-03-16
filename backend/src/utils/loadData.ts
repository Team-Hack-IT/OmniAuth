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

export default loadData;
