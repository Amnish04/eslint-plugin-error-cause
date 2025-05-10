import configs from "./configs";
import packageJson from "../package.json";
import { swallowedErrorContext } from "./rules";
const meta = { name: packageJson.name, version: packageJson.version };

const plugin = {
    meta,
    configs,
    rules: {
        "swallowed-error-context": swallowedErrorContext,
    },
    processors: {},
};

export default plugin;
