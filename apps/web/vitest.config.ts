import { readFileSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		{
			name: "hardhat-artifact-json",
			enforce: "pre",
			resolveId(source, importer) {
				if (
					!importer ||
					!source.includes("Module#") ||
					!source.endsWith(".json")
				) {
					return null;
				}

				return `\0hardhat-artifact-json:${Buffer.from(
					path.resolve(path.dirname(importer), source),
				).toString("base64url")}`;
			},
			load(id) {
				if (!id.startsWith("\0hardhat-artifact-json:")) {
					return null;
				}

				const filePath = Buffer.from(
					id.replace("\0hardhat-artifact-json:", ""),
					"base64url",
				).toString("utf8");
				return `export default ${readFileSync(filePath, "utf8")};`;
			},
		},
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname),
		},
	},
	test: {
		environment: "node",
		include: ["test/**/*.test.ts"],
	},
});
