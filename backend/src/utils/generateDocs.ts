import yaml from "yamljs";
import fs from "fs";

export default function generateDocs() {
    try {
        const dirpath = "./src/docs";

        if (fs.existsSync(`${dirpath}/Combined.yaml`)) {
            fs.unlinkSync(`${dirpath}/Combined.yaml`);
        }

        fs.copyFileSync(`${dirpath}/User.yaml`, `${dirpath}/Combined.yaml`);
        fs.appendFileSync(
            `${dirpath}/Combined.yaml`,
            fs.readFileSync(`${dirpath}/Business.yaml`, "utf8").slice(6)
        );

        return yaml.parse(
            yaml.stringify({
                ...yaml.load(`${dirpath}/Combined.yaml`),
                ...yaml.load(`${dirpath}/Component.yaml`),
            })
        );
    } catch (error) {
        console.error(error);
    }
}
