module.exports = {
    root: true,
    extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-native/all', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['react', 'react-native', '@typescript-eslint', 'truenorth-performance'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    env: {
        "react-native/react-native": true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        'truenorth-performance/no-scrollview': 'error',
        'truenorth-performance/enforce-flashlist': 'error',
        'truenorth-performance/no-rn-image': 'error',
        'truenorth-performance/enforce-estimated-item-size': 'error',
        'truenorth-performance/no-inline-renderitem': 'error',
        'react-native/no-inline-styles': 'warn',
        'react-native/no-color-literals': 'off',
        'react-native/sort-styles': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
    },
};
