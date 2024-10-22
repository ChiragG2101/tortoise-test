const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    ...[
      "@vercel/style-guide/eslint/node",
      "@vercel/style-guide/eslint/typescript",
      "@vercel/style-guide/eslint/browser",
      "@vercel/style-guide/eslint/react",
      "@vercel/style-guide/eslint/next",
    ].map(require.resolve),
    "turbo",
  ],
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
      node: {
        extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/"],
  rules: {
    "import/no-default-export": "off",
    "unicorn/filename-case": "off",
    "import/order": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/alt-text": "off",
    "no-empty": "off",
    eqeqeq: "off",
    "no-undef": "off",
    "no-unsafe-optional-chaining": "off",
    "no-implicit-coercion": "off",
    "no-duplicate-case": "off", // Disabled rule
    "import/no-useless-path-segments": "off", // Disabled rule
    "no-nested-ternary": "off", // Disabled rule
    "import/no-cycle": "off", // Disabled rule
    "react/jsx-sort-props": "off",
    "react/jsx-no-useless-fragment": "off",
    camelcase: "off",
    "react/jsx-no-leaked-render": "off",
    "react/self-closing-comp": "off",
    "import/no-unresolved": "off",
    "react/function-component-definition": "off",
    "no-case-declarations": "off",
    "object-shorthand": "off",
    "eslint-comments/require-description": "off",
    "no-unused-vars": "off",
    "prefer-named-capture-group": "off",
    "no-console": "off",
    "react-hooks/exhaustive-deps": "off",
    "turbo/no-undeclared-env-vars": "off",
  },
};
