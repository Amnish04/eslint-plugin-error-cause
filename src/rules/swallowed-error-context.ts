import { ESLintUtils } from "@typescript-eslint/utils";

interface MyPluginDocs {
    recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<MyPluginDocs>(
    // TODO: Fix this with the actual docs URL when published to npm.
    (name) => `https://example.com/rule/${name}`
);

// https://typescript-eslint.io/developers/custom-rules#rulecreator
type MessageIds = "missing-cause";
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
        messages: {
            "missing-cause":
                "Include the original caught error as the `cause` of the custom error.",
        },
        type: "suggestion",
        schema: [],
    },
    defaultOptions: [],
});
