module.exports = {
    create(context) {
        return {
            JSXOpeningElement(node) {
                if (
                    node.name.name === "FlashList" &&
                    !node.attributes.some(
                        attr => attr.name?.name === "estimatedItemSize"
                    )
                ) {
                    context.report({
                        node,
                        message:
                            "FlashList must define estimatedItemSize to avoid layout thrashing.",
                    });
                }
            },
        };
    },
};
