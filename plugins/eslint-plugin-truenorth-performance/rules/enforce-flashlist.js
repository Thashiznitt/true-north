module.exports = {
    create(context) {
        return {
            JSXIdentifier(node) {
                if (node.name === "FlatList") {
                    context.report({
                        node,
                        message:
                            "FlatList is restricted. FlashList is mandatory for feeds, chats, dashboards.",
                    });
                }
            },
        };
    },
};
