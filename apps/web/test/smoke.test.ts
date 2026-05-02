import { describe, expect, it } from "vitest";
import { networkConfig } from "@/config/network-config";
import { cn } from "@/lib/utils";

describe("test setup", () => {
	it("resolves TypeScript path aliases and contract JSON imports", () => {
		expect(cn("base", false && "hidden", "active")).toBe("base active");
		expect(networkConfig.some((network) => network.networkId === "11155111")).toBe(
			true,
		);
	});
});
