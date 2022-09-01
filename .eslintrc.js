module.exports = {
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "next",
    'plugin:react/recommended',
    'airbnb', 'next/core-web-vitals',
    "plugin:prettier/recommended"
  ],
  plugins: ['react', '@typescript-eslint', 'jest'],
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  globals: {
    JSX: "readonly",
    React: "readonly",
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    include: [
          "src/pages/*",
          "src/contexts",
         ],
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      }
    ],

    "import/no-extraneous-dependencies": ["error", {"devDependencies": true, "optionalDependencies": true, "peerDependencies": true}],

    "react-hooks/rules-of-hooks": "error",
  "import/no-duplicates": "off",
  "react-hooks/exhaustive-deps": "warn",
  "camelcase": "off",
  "react/jsx-one-expression-per-line": "off",
  "react/jsx-filename-extension": [1, { "extensions": [".tsx"] }],
  "import/prefer-default-export": "off",
  "react/jsx-props-no-spreading": "off",
  "no-unused-expressions": "off",
  "react/jsx-curly-newline": "off",
  "no-nested-ternary": "off",
  "react/react-in-jsx-scope": "off",
  "@typescript-eslint/interface-name-prefix": "off",
  "@typescript-eslint/naming-convention": [
    "error",
    {
      "selector": "interface",
      "format": ["PascalCase"],
      "custom": {
        "regex": "^I[A-Z]",
        "match": true
      }
    },
    {
      "selector": "typeLike",
      "format": ["PascalCase"],
      "custom": {
        "regex": "^I[A-Z]",
        "match": true
      }
    },
  ],
  "react/prop-types": "off",
  "no-plusplus": "off",
  "@typescript-eslint/explicit-function-return-type": [
    "error",
    {
      "allowExpressions": true
    }
  ],

  "react/function-component-definition":[2, { "namedComponents": "arrow-function" }],

    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "ts": "never",
        "tsx": "never"
      }
    ]
  },
  "settings": {
    "import/resolver": {
      "typescript": {}
    }
  }
};
