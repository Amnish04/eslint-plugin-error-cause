import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

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
            CatchClause(node) {
                // Check if there is a root error that could have been lost
                const rootError =
                    node.param?.type === TSESTree.AST_NODE_TYPES.Identifier
                        ? node.param
                        : null;
                if (!rootError) {
                    return;
                }

                // Find the first Throw Statement
                const customThrow = findThrowStatement(node.body);

                // Check if a new error is being thrown
                if (customThrow && isThrowingNewError(customThrow)) {
                    // Check if there is a cause attached to the new error
                    const customThrowCause = findThrowNewErrorCause(customThrow);
                    if (!customThrowCause) {
                        context.report({
                            messageId: "missing-cause",
                            node: customThrow,
                        });
                        return;
                    }

                    // Verify the attached cause matches the root error that is being handled
                    if (
                        !(
                            customThrowCause?.type ===
                                TSESTree.AST_NODE_TYPES.Identifier &&
                            customThrowCause.name === rootError.name
                        )
                    ) {
                        context.report({
                            messageId: "missing-cause",
                            node: customThrowCause,
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

/**
 * Finds and returns the first `ThrowStatement` in the block, `undefined` if not found.
 */
function findThrowStatement(
    block: TSESTree.BlockStatement
): TSESTree.ThrowStatement | undefined {
    for (const node of block.body) {
        if (node.type === TSESTree.AST_NODE_TYPES.ThrowStatement) {
            return node;
        }
        // Check nested blocks (e.g., if, for, while, etc.)
        if ("body" in node && Array.isArray(node.body)) {
            const nested = findThrowStatement(node as TSESTree.BlockStatement);
            if (nested) return nested;
        }
    }
    return undefined;
}

type ThrowNewErrorStatement = Omit<TSESTree.ThrowStatement, "argument"> & {
    argument: TSESTree.NewExpression;
};

function isThrowingNewError(
    throwStatement: TSESTree.ThrowStatement
): throwStatement is ThrowNewErrorStatement {
    return (
        throwStatement.argument.type === TSESTree.AST_NODE_TYPES.NewExpression &&
        throwStatement.argument.callee.type === TSESTree.AST_NODE_TYPES.Identifier &&
        throwStatement.argument.callee.name === "Error"
    );
}

function findThrowNewErrorCause(throwStatement: ThrowNewErrorStatement) {
    const newExpression = throwStatement.argument;
    const errorOptions = newExpression.arguments[1];
    const causeProperty =
        errorOptions?.type === TSESTree.AST_NODE_TYPES.ObjectExpression
            ? (errorOptions.properties.find(
                  (prop) =>
                      prop.type === TSESTree.AST_NODE_TYPES.Property &&
                      prop.key.type === TSESTree.AST_NODE_TYPES.Identifier &&
                      prop.key.name === "cause"
              ) as TSESTree.Property)
            : undefined;

    return causeProperty?.value;
}
