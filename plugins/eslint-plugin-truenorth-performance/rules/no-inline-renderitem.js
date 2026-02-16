module.exports = {
    create(context) {
        return {
            JSXAttribute(node) {
                if (
                    node.name.name === "renderItem" &&
                    node.value.expression?.type === "ArrowFunctionExpression"
                ) {
                    context.report({
                        node,
                        message:
                            "Inline renderItem causes re-renders. Memoize and extract it.",
                    });
                }
            },
        };
    },
};
