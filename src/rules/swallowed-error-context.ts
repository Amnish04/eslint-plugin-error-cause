import { type JSRuleDefinition } from "eslint";

export const swallowedErrorContext: JSRuleDefinition = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Description of the rule",
        },
        schema: [], // no options
    },
    create: function (context) {
        return {
            // callback functions
        };
    },
};
