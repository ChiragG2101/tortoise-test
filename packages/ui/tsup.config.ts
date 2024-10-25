import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
    entry: "./src/index.ts",
    compilerOptions: {
      declarationDir: "./dist/types",
      // declarationMap: true,
      // This helps IDEs navigate to source files
      sourceMap: true,
    },
  },
  splitting: true,
  treeshake: true,
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "@nextui-org/react",
    "@phosphor-icons/react",
    "react-dropzone",
    "react-hook-form",
  ],
});
