import packageJson from "../package.json";
import rules from "./rules";

const meta = { name: packageJson.name, version: packageJson.version };

const plugin = {
    meta,
    configs: {},
    rules,
    processors: {},
};

const configs = {
    recommended: [
        {
            plugins: {
                "error-cause": plugin,
            },
            rules: {
                "error-cause/no-swallowed-error-cause": "warn",
            },
        },
    ],
};

type ErrorCausePlugin = Omit<typeof plugin, "configs"> & {
    configs: typeof configs;
};

Object.assign(plugin.configs, configs);

export default plugin as ErrorCausePlugin;
