import { gaslessERC721AbiMap } from "@/config/abi-map";
import type { NetworkConfig } from "@/config/network-config";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";

export function useContractData(network: NetworkConfig | undefined) {
	const [maxSupply, setMaxSupply] = useState<number | null>(null);
	const [totalSupply, setTotalSupply] = useState<number | null>(null);
	const [remainingMintAmount, setRemainingMintAmount] = useState<number | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);
	const { address } = useWeb3ModalAccount();

	const fetchSupplyData = useCallback(async () => {
		if (!network) {
			console.log("Network not available");
			return;
		}

		try {
			const provider = new ethers.JsonRpcProvider(network.rpcUrl);
			const contractModule = gaslessERC721AbiMap[network.networkId];

			if (!contractModule || !network.gaslessMintCollectionAddress) {
				throw new Error("Contract information is missing");
			}

			const contract = new ethers.Contract(
				network.gaslessMintCollectionAddress,
				contractModule.abi,
				provider,
			);

			const [maxSupply, totalSupply] = await Promise.all([
				contract.maxSupply(),
				contract.totalSupply(),
			]);

			setMaxSupply(Number(maxSupply));
			setTotalSupply(Number(totalSupply));

			if (address) {
				const remainingMintAmountForUser =
					await contract.remainingMintAmount(address);
				setRemainingMintAmount(Number(remainingMintAmountForUser));
			} else {
				setRemainingMintAmount(null);
			}

			setError(null);
		} catch (error) {
			console.error("Failed to fetch contract data:", error);
			setError("Failed to load contract data");
		}
	}, [network, address]);

	useEffect(() => {
		fetchSupplyData();
	}, [fetchSupplyData]);

	const updateTotalSupply = useCallback(async () => {
		if (!network) return;

		try {
			const provider = new ethers.JsonRpcProvider(network.rpcUrl);
			const contractModule = gaslessERC721AbiMap[network.networkId];

			if (!contractModule || !network.gaslessMintCollectionAddress) {
				throw new Error("Contract information is missing");
			}

			const contract = new ethers.Contract(
				network.gaslessMintCollectionAddress,
				contractModule.abi,
				provider,
			);

			const totalSupply = await contract.totalSupply();
			setTotalSupply(Number(totalSupply));

			if (address) {
				const remainingMintAmountForUser =
					await contract.remainingMintAmount(address);
				setRemainingMintAmount(Number(remainingMintAmountForUser));
			}
		} catch (error) {
			console.error("Failed to update supply data:", error);
			setError("Failed to update supply data");
		}
	}, [network, address]);

	return {
		maxSupply,
		totalSupply,
		remainingMintAmount,
		error,
		updateTotalSupply,
		fetchSupplyData,
	};
}
