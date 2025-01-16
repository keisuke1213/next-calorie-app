import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // ここでルールの緩和を指定します
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // 'any' 型の使用を警告に変更
      "@typescript-eslint/no-unused-vars": "off", // 未使用の変数のチェックを無効化
      "react-hooks/rules-of-hooks": "warn", // React Hooks のルールを警告に変更
    },
  },
];

export default eslintConfig;
