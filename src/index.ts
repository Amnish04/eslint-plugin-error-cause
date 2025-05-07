import configs from "./configs";
import packageJson from "../package.json";
const meta = { name: packageJson.name, version: packageJson.version };

const plugin = {
    meta,
    configs,
    rules: {},
    processors: {},
};

export default plugin;
