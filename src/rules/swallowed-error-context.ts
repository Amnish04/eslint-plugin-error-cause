import { ESLintUtils } from "@typescript-eslint/utils";

interface MyPluginDocs {
    recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<MyPluginDocs>(
    () => "https://github.com/Amnish04/eslint-plugin-error-context"
);

// https://typescript-eslint.io/developers/custom-rules#rulecreator
const messages = {
    "missing-cause":
        "Include the original caught error as the `cause` of the custom error.",
};
type MessageIds = keyof typeof messages;
type Options = []; // This rule does not require any options

export const noSwallowedErrorContext = createRule<Options, MessageIds>({
    create(context) {
        return {
            FunctionDeclaration(node) {
                if (node.id != null) {
                    if (/^[a-z]/.test(node.id.name)) {
                        context.report({
                            messageId: "missing-cause",
                            node: node.id,
                        });
                    }
                }
            },
        };
    },
    name: "no-swallowed-error-context",
    meta: {
        docs: {
            description:
                "disallow losing original error `cause` when rethrowing custom errors.",
            recommended: true,
        },
        messages,
        type: "suggestion",
        schema: [],
    },
    defaultOptions: [],
});
