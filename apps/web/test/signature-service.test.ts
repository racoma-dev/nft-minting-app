import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	contract: {
		getNonce: vi.fn(),
		gaslessMint: vi.fn(),
	},
	JsonRpcProvider: vi.fn(),
	Contract: vi.fn(),
	Wallet: vi.fn(),
	solidityPackedKeccak256: vi.fn(),
	hexlify: vi.fn(),
	getBytes: vi.fn(),
	verifyMessage: vi.fn(),
	isAddress: vi.fn(),
}));

vi.mock("ethers", () => ({
	ethers: {
		JsonRpcProvider: mocks.JsonRpcProvider,
		Contract: mocks.Contract,
		Wallet: mocks.Wallet,
		solidityPackedKeccak256: mocks.solidityPackedKeccak256,
		hexlify: mocks.hexlify,
		getBytes: mocks.getBytes,
		verifyMessage: mocks.verifyMessage,
		isAddress: mocks.isAddress,
	},
}));

describe("signature-service", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
		vi.setSystemTime(new Date("2026-05-02T00:00:00.000Z"));
		process.env.RELAYER_PRIVATE_KEY = "0xrelayer-private-key";

		mocks.contract.getNonce.mockResolvedValue(42n);
		mocks.contract.gaslessMint.mockResolvedValue({
			wait: vi.fn().mockResolvedValue({
				hash: "0xtx",
				blockNumber: 12345n,
			}),
		});
		mocks.JsonRpcProvider.mockImplementation(function (rpcUrl: string) {
			return { rpcUrl };
		});
		mocks.Contract.mockImplementation(function () {
			return mocks.contract;
		});
		mocks.Wallet.mockImplementation(function () {
			return {
				address: "0xRelayer000000000000000000000000000000000001",
				connect: vi.fn().mockReturnValue({
					address: "0xRelayer000000000000000000000000000000000001",
				}),
			};
		});
		mocks.solidityPackedKeccak256.mockReturnValue("0xmessagehash");
		mocks.hexlify.mockImplementation((value: string) => value);
		mocks.getBytes.mockImplementation((value: string) => `bytes:${value}`);
		mocks.verifyMessage.mockReturnValue(
			"0x1111111111111111111111111111111111111111",
		);
		mocks.isAddress.mockImplementation(
			(value: string) => value.startsWith("0x") && value.length === 42,
		);
	});

	it("サポート対象ネットワークのmintパラメータを生成する", async () => {
		const { getMintParams } = await import("@/lib/server/signature-service");

		const result = await getMintParams(
			"0x1111111111111111111111111111111111111111",
			2,
			"11155111",
		);

		expect(result).toEqual({
			nonce: "42",
			expiry: 1777683600,
			messageToSign: "0xmessagehash",
		});
		expect(mocks.contract.getNonce).toHaveBeenCalledWith(
			"0x1111111111111111111111111111111111111111",
		);
		expect(mocks.solidityPackedKeccak256).toHaveBeenCalledWith(
			["address", "address", "uint256", "uint256", "uint256", "address"],
			[
				"0xRelayer000000000000000000000000000000000001",
				"0x1111111111111111111111111111111111111111",
				2,
				42n,
				1777683600,
				expect.any(String),
			],
		);
	});

	it("未対応ネットワークではmintパラメータを生成しない", async () => {
		const { getMintParams } = await import("@/lib/server/signature-service");

		await expect(
			getMintParams("0x1111111111111111111111111111111111111111", 1, "999"),
		).rejects.toThrow("Unsupported network: 999");
		expect(mocks.Contract).not.toHaveBeenCalled();
	});

	it("不正なquantityではmintパラメータを生成しない", async () => {
		const { getMintParams } = await import("@/lib/server/signature-service");

		await expect(
			getMintParams(
				"0x1111111111111111111111111111111111111111",
				0,
				"11155111",
			),
		).rejects.toThrow("Invalid quantity");
		expect(mocks.Contract).not.toHaveBeenCalled();
	});

	it("不正な署名者アドレスではmintパラメータを生成しない", async () => {
		const { getMintParams } = await import("@/lib/server/signature-service");

		await expect(
			getMintParams("not-an-address", 1, "11155111"),
		).rejects.toThrow("Invalid signer address");
		expect(mocks.Contract).not.toHaveBeenCalled();
	});

	it("署名者と復元アドレスが一致すればmintを実行する", async () => {
		const { verifyAndMint } = await import("@/lib/server/signature-service");

		const result = await verifyAndMint(
			"0x1111111111111111111111111111111111111111",
			1,
			"42",
			1777683600,
			"0xsignature",
			"11155111",
		);

		expect(result).toEqual({
			transactionHash: "0xtx",
			blockNumber: "12345",
		});
		expect(mocks.contract.gaslessMint).toHaveBeenCalledWith(
			"0x1111111111111111111111111111111111111111",
			1,
			42n,
			1777683600,
			"0xsignature",
		);
	});

	it("署名者と復元アドレスが一致しなければmintしない", async () => {
		mocks.verifyMessage.mockReturnValue(
			"0x2222222222222222222222222222222222222222",
		);
		const { verifyAndMint } = await import("@/lib/server/signature-service");

		await expect(
			verifyAndMint(
				"0x1111111111111111111111111111111111111111",
				1,
				"42",
				1777683600,
				"0xsignature",
				"11155111",
			),
		).rejects.toThrow("Invalid signature");
		expect(mocks.contract.gaslessMint).not.toHaveBeenCalled();
	});
});
