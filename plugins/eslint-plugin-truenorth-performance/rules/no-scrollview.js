module.exports = {
    meta: { type: "problem" },
    create(context) {
        return {
            JSXIdentifier(node) {
                if (node.name === "ScrollView") {
                    context.report({
                        node,
                        message:
                            "ScrollView is forbidden. Use FlashList for any dynamic or scrollable content.",
                    });
                }
            },
        };
    },
};
