import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...nextVitals.map((config) => ({
    ...config,
    languageOptions: {
      ...config.languageOptions,
      parser: tseslint.parser,
    },
  })),
  prettier,
  {
    settings: {
      react: { version: "19" },
    },
  },
  // eslint-config-nextのデフォルト無視設定をオーバーライドします。
  globalIgnores([
    // eslint-config-nextのデフォルト無視設定：
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
