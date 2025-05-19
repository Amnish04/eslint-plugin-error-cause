import * as configs from "./configs";
import packageJson from "../package.json";
import { noSwallowedErrorContext } from "./rules";
const meta = { name: packageJson.name, version: packageJson.version };

const plugin = {
    meta,
    configs,
    rules: {
        "no-swallowed-error-cause": noSwallowedErrorContext,
    },
    processors: {},
};

export default plugin;
