import configs from "./configs";
import packageJson from "../package.json";
import { noSwallowedErrorContext } from "./rules";
const meta = { name: packageJson.name, version: packageJson.version };

const plugin = {
    meta,
    configs,
    rules: {
        "swallowed-error-context": noSwallowedErrorContext,
    },
    processors: {},
};

export default plugin;
