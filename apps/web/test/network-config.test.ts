import {
	gaslessERC721AbiMap,
	soulboundERC721AbiMap,
	standardERC721AbiMap,
} from "@/config/abi-map";
import { networkConfig } from "@/config/network-config";
import { describe, expect, it } from "vitest";

const undeployedNetworkIds = new Set(["97"]);

const abiMaps = {
	standard: standardERC721AbiMap,
	gasless: gaslessERC721AbiMap,
	soulbound: soulboundERC721AbiMap,
};

function expectAddress(value: string, label: string) {
	expect(value, `${label} should be a deployed contract address`).toMatch(
		/^0x[a-fA-F0-9]{40}$/,
	);
}

function expectAbiArtifact(value: unknown, label: string) {
	expect(value, `${label} should be an imported artifact object`).toEqual(
		expect.objectContaining({
			abi: expect.any(Array),
		}),
	);
}

describe("network config と ABI map の整合性", () => {
	it("networkConfig の networkId は重複しない", () => {
		const networkIds = networkConfig.map((network) => network.networkId);

		expect(new Set(networkIds).size).toBe(networkIds.length);
	});

	it("未デプロイネットワークは空アドレスと空ABI mapを明示的に持つ", () => {
		for (const network of networkConfig.filter((entry) =>
			undeployedNetworkIds.has(entry.networkId),
		)) {
			expect(network.mintCollectionAddress).toBe("");
			expect(network.gaslessMintCollectionAddress).toBe("");
			expect(network.soulboundCollectionAddress).toBe("");
			expect(standardERC721AbiMap[network.networkId]).toBe("");
			expect(gaslessERC721AbiMap[network.networkId]).toBe("");
			expect(soulboundERC721AbiMap[network.networkId]).toBe("");
		}
	});

	it("デプロイ済みネットワークは各collection addressとABI artifactを持つ", () => {
		for (const network of networkConfig.filter(
			(entry) => !undeployedNetworkIds.has(entry.networkId),
		)) {
			expectAddress(
				network.mintCollectionAddress,
				`${network.networkName} standard address`,
			);
			expectAddress(
				network.gaslessMintCollectionAddress,
				`${network.networkName} gasless address`,
			);
			expectAddress(
				network.soulboundCollectionAddress,
				`${network.networkName} soulbound address`,
			);

			expectAbiArtifact(
				standardERC721AbiMap[network.networkId],
				`${network.networkName} standard ABI`,
			);
			expectAbiArtifact(
				gaslessERC721AbiMap[network.networkId],
				`${network.networkName} gasless ABI`,
			);
			expectAbiArtifact(
				soulboundERC721AbiMap[network.networkId],
				`${network.networkName} soulbound ABI`,
			);
		}
	});

	it("ABI mapのnetworkIdはnetworkConfigと一致する", () => {
		const configuredNetworkIds = new Set(
			networkConfig.map((network) => network.networkId),
		);

		for (const [mapName, abiMap] of Object.entries(abiMaps)) {
			expect(
				Object.keys(abiMap).sort(),
				`${mapName} ABI map should use the same networkIds as networkConfig`,
			).toEqual([...configuredNetworkIds].sort());
		}
	});
});
