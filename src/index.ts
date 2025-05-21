import packageJson from "../package.json";
import rules from "./rules";

const meta = { name: packageJson.name, version: packageJson.version };

const plugin = {
    meta,
    configs: {},
    rules,
    processors: {},
};

Object.assign(plugin.configs, {
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
});

module.exports = plugin;
