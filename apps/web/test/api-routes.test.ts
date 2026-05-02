import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({
	getMintParams: vi.fn(),
	verifyAndMint: vi.fn(),
}));

vi.mock("@/lib/server/signature-service", () => ({
	getMintParams: serviceMocks.getMintParams,
	verifyAndMint: serviceMocks.verifyAndMint,
}));

function jsonRequest(body: unknown) {
	return new Request("http://localhost/api", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
}

function rawJsonRequest(body: string) {
	return new Request("http://localhost/api", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body,
	});
}

describe("/api/get-mint-params route", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("Node.js runtime と dynamic route 設定を維持する", async () => {
		const route = await import("@/app/api/get-mint-params/route");

		expect(route.runtime).toBe("nodejs");
		expect(route.dynamic).toBe("force-dynamic");
	});

	it("mintパラメータをJSONで返す", async () => {
		serviceMocks.getMintParams.mockResolvedValue({
			nonce: 42n,
			expiry: 1777683600,
			messageToSign: "0xmessagehash",
		});
		const { POST } = await import("@/app/api/get-mint-params/route");

		const response = await POST(
			jsonRequest({
				address: "0x1111111111111111111111111111111111111111",
				quantity: 2,
				networkId: "11155111",
			}),
		);

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			nonce: "42",
			expiry: 1777683600,
			messageToSign: "0xmessagehash",
		});
		expect(serviceMocks.getMintParams).toHaveBeenCalledWith(
			"0x1111111111111111111111111111111111111111",
			2,
			"11155111",
		);
	});

	it("サービス層のエラーを500レスポンスに変換する", async () => {
		serviceMocks.getMintParams.mockRejectedValue(
			new Error("Unsupported network: 999"),
		);
		const { POST } = await import("@/app/api/get-mint-params/route");

		const response = await POST(
			jsonRequest({
				address: "0x1111111111111111111111111111111111111111",
				quantity: 1,
				networkId: "999",
			}),
		);

		expect(response.status).toBe(500);
		await expect(response.json()).resolves.toEqual({
			error: "Failed to get mint parameters",
			message: "Unsupported network: 999",
		});
	});

	it("不正JSONを500レスポンスに変換する", async () => {
		const { POST } = await import("@/app/api/get-mint-params/route");

		const response = await POST(rawJsonRequest("{"));

		expect(response.status).toBe(500);
		await expect(response.json()).resolves.toMatchObject({
			error: "Failed to get mint parameters",
		});
		expect(serviceMocks.getMintParams).not.toHaveBeenCalled();
	});
});

describe("/api/mint route", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("Node.js runtime、dynamic route、maxDuration設定を維持する", async () => {
		const route = await import("@/app/api/mint/route");

		expect(route.runtime).toBe("nodejs");
		expect(route.dynamic).toBe("force-dynamic");
		expect(route.maxDuration).toBe(30);
	});

	it("mint結果をJSONで返す", async () => {
		serviceMocks.verifyAndMint.mockResolvedValue({
			transactionHash: "0xtx",
			blockNumber: "12345",
		});
		const { POST } = await import("@/app/api/mint/route");

		const response = await POST(
			jsonRequest({
				address: "0x1111111111111111111111111111111111111111",
				quantity: 1,
				nonce: "42",
				expiry: 1777683600,
				signature: "0xsignature",
				networkId: "11155111",
			}),
		);

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			transactionHash: "0xtx",
			blockNumber: "12345",
		});
		expect(serviceMocks.verifyAndMint).toHaveBeenCalledWith(
			"0x1111111111111111111111111111111111111111",
			1,
			"42",
			1777683600,
			"0xsignature",
			"11155111",
		);
	});

	it("サービス層のエラーを500レスポンスに変換する", async () => {
		serviceMocks.verifyAndMint.mockRejectedValue(
			new Error("Invalid signature"),
		);
		const { POST } = await import("@/app/api/mint/route");

		const response = await POST(
			jsonRequest({
				address: "0x1111111111111111111111111111111111111111",
				quantity: 1,
				nonce: "42",
				expiry: 1777683600,
				signature: "0xbadsignature",
				networkId: "11155111",
			}),
		);

		expect(response.status).toBe(500);
		await expect(response.json()).resolves.toEqual({
			error: "Failed to mint",
			message: "Invalid signature",
		});
	});

	it("不正JSONを500レスポンスに変換する", async () => {
		const { POST } = await import("@/app/api/mint/route");

		const response = await POST(rawJsonRequest("{"));

		expect(response.status).toBe(500);
		await expect(response.json()).resolves.toMatchObject({
			error: "Failed to mint",
		});
		expect(serviceMocks.verifyAndMint).not.toHaveBeenCalled();
	});
});
