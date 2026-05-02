import { standardERC721AbiMap } from "@/config/abi-map";
import type { NetworkConfig } from "@/config/network-config";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";

export function useContractData(network: NetworkConfig | undefined) {
	const [maxSupply, setMaxSupply] = useState<number | null>(null); // 最大供給量
	const [totalSupply, setTotalSupply] = useState<number | null>(null); // 現在の供給量
	const [maxMintAmount, setMaxMintAmount] = useState<number | null>(null); // 1回の最大ミント数
	const [error, setError] = useState<string | null>(null); // ミント成功フラグ

	const fetchSupplyData = useCallback(async () => {
		try {
			if (!network) {
				throw new Error("Network is undefined");
			}

			const provider = new ethers.JsonRpcProvider(network.rpcUrl);
			const contractModule = standardERC721AbiMap[network.networkId];

			if (!contractModule || !network.mintCollectionAddress) {
				throw new Error("Contract information is missing");
			}

			const contract = new ethers.Contract(
				network.mintCollectionAddress,
				contractModule.abi,
				provider,
			);

			const maxSupply = await contract.maxSupply();
			const totalSupply = await contract.totalSupply();
			const maxMintAmount = await contract.maxMintAmount();

			setMaxSupply(Number(maxSupply));
			setTotalSupply(Number(totalSupply));
			setMaxMintAmount(Number(maxMintAmount));
		} catch (error) {
			console.error("Failed to fetch contract data:", error);
			setError("Failed to load contract data");
		}
	}, [network]);

	const updateTotalSupply = useCallback(async () => {
		if (!network) return;

		try {
			const provider = new ethers.JsonRpcProvider(network.rpcUrl);
			const contractModule = standardERC721AbiMap[network.networkId];

			if (!contractModule || !network.mintCollectionAddress) {
				throw new Error("Contract information is missing");
			}

			const contract = new ethers.Contract(
				network.mintCollectionAddress,
				contractModule.abi,
				provider,
			);

			const totalSupply = await contract.totalSupply();
			setTotalSupply(Number(totalSupply));
		} catch (error) {
			console.error("Failed to update total supply:", error);
			setError("Failed to update total supply");
		}
	}, [network]);

	useEffect(() => {
		fetchSupplyData();
	}, [fetchSupplyData]);

	return {
		maxSupply,
		totalSupply,
		maxMintAmount,
		error,
		updateTotalSupply,
	};
}
