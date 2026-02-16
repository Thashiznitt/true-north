module.exports = {
    create(context) {
        return {
            ImportDeclaration(node) {
                if (
                    node.source.value === "react-native" &&
                    node.specifiers.some(s => s.imported?.name === "Image")
                ) {
                    context.report({
                        node,
                        message:
                            "react-native Image is forbidden. Use expo-image with caching enabled.",
                    });
                }
            },
        };
    },
};
