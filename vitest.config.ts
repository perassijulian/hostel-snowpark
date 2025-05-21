import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: "./test/setup.ts",
    include: ["test/**/*.test.ts"],
  },
  plugins: [tsconfigPaths()],
});
