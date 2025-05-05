import configs from "./configs";
import packageJson from "../package.json";
const meta = { name: packageJson.name, version: packageJson.version };

export default {
    meta,
    configs,
    rules: {},
    processors: {},
};
