import lineaSepoliaContractAddresses from "../../../contract/ignition/deployments/chain-59141/deployed_addresses.json";
import amoyContractAddresses from "../../../contract/ignition/deployments/chain-80002/deployed_addresses.json";
import baseSepoliaContractAddresses from "../../../contract/ignition/deployments/chain-84532/deployed_addresses.json";
import arbitrumSepoliaContractAddresses from "../../../contract/ignition/deployments/chain-421614/deployed_addresses.json";
import sepoliaContractAddresses from "../../../contract/ignition/deployments/chain-11155111/deployed_addresses.json";
import optimismSepoliaContractAddresses from "../../../contract/ignition/deployments/chain-11155420/deployed_addresses.json";
import blastSepoliaContractAddresses from "../../../contract/ignition/deployments/chain-168587773/deployed_addresses.json";

export interface NetworkConfig {
	networkId: string;
	networkName: string;
	networkUrl: string;
	currency: string;
	explorerUrl?: string;
	rpcUrl: string;
	faucetUrl?: string;
	mintCollectionAddress: string;
	gaslessMintCollectionAddress: string;
	soulboundCollectionAddress: string;
}

export const networkConfig: NetworkConfig[] = [
	{
		networkId: "11155111",
		networkName: "Sepolia",
		networkUrl: "sepolia",
		currency: "ETH",
		explorerUrl: "https://sepolia.etherscan.io",
		rpcUrl: "https://11155111.rpc.thirdweb.com",
		faucetUrl: "https://www.alchemy.com/faucets/ethereum-sepolia",
		mintCollectionAddress:
			sepoliaContractAddresses["StandardERC721AModule#StandardERC721A"],
		gaslessMintCollectionAddress:
			sepoliaContractAddresses["GaslessERC721AModule#GaslessERC721A"],
		soulboundCollectionAddress:
			sepoliaContractAddresses["SoulboundERC721AModule#SoulboundERC721A"],
	},
	{
		networkId: "80002",
		networkName: "Amoy",
		networkUrl: "amoy",
		currency: "POL",
		explorerUrl: "https://amoy.polygonscan.com",
		rpcUrl: "https://rpc-amoy.polygon.technology",
		faucetUrl: "https://www.alchemy.com/faucets/polygon-amoy",
		mintCollectionAddress:
			amoyContractAddresses["StandardERC721AModule#StandardERC721A"],
		gaslessMintCollectionAddress:
			amoyContractAddresses["GaslessERC721AModule#GaslessERC721A"],
		soulboundCollectionAddress:
			amoyContractAddresses["SoulboundERC721AModule#SoulboundERC721A"],
	},
	{
		networkId: "97",
		networkName: "BSC Testnet",
		networkUrl: "bsc-testnet",
		currency: "BNB",
		explorerUrl: "https://testnet.bscscan.com",
		rpcUrl: "https://bsc-testnet-dataseed.bnbchain.org",
		faucetUrl: "https://www.bnbchain.org/en/testnet-faucet",
		mintCollectionAddress: "", // FIXME: コントラクトをデプロイ後に変更
		gaslessMintCollectionAddress: "", // FIXME: コントラクトをデプロイ後に変更
		soulboundCollectionAddress: "", // FIXME: コントラクトをデプロイ後に変更
	},
	{
		networkId: "11155420",
		networkName: "Optimism Sepolia",
		networkUrl: "optimism-sepolia",
		currency: "ETH",
		explorerUrl: "https://sepolia-optimistic.etherscan.io",
		rpcUrl: "https://sepolia.optimism.io",
		faucetUrl: "https://www.alchemy.com/faucets/optimism-sepolia",
		mintCollectionAddress:
			optimismSepoliaContractAddresses["StandardERC721AModule#StandardERC721A"],
		gaslessMintCollectionAddress:
			optimismSepoliaContractAddresses["GaslessERC721AModule#GaslessERC721A"],
		soulboundCollectionAddress:
			optimismSepoliaContractAddresses[
				"SoulboundERC721AModule#SoulboundERC721A"
			],
	},
	{
		networkId: "421614",
		networkName: "Arbitrum Sepolia",
		networkUrl: "arbitrum-sepolia",
		currency: "ETH",
		explorerUrl: "https://sepolia.arbiscan.io",
		rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
		faucetUrl: "https://www.alchemy.com/faucets/arbitrum-sepolia",
		mintCollectionAddress:
			arbitrumSepoliaContractAddresses["StandardERC721AModule#StandardERC721A"],
		gaslessMintCollectionAddress:
			arbitrumSepoliaContractAddresses["GaslessERC721AModule#GaslessERC721A"],
		soulboundCollectionAddress:
			arbitrumSepoliaContractAddresses[
				"SoulboundERC721AModule#SoulboundERC721A"
			],
	},
	{
		networkId: "84532",
		networkName: "Base Sepolia",
		networkUrl: "base-sepolia",
		currency: "ETH",
		explorerUrl: "https://sepolia.basescan.org",
		rpcUrl: "https://sepolia.base.org",
		faucetUrl: "https://www.alchemy.com/faucets/base-sepolia",
		mintCollectionAddress:
			baseSepoliaContractAddresses["StandardERC721AModule#StandardERC721A"],
		gaslessMintCollectionAddress:
			baseSepoliaContractAddresses["GaslessERC721AModule#GaslessERC721A"],
		soulboundCollectionAddress:
			baseSepoliaContractAddresses["SoulboundERC721AModule#SoulboundERC721A"],
	},
	{
		networkId: "168587773",
		networkName: "Blast Sepolia",
		networkUrl: "blast-sepolia",
		currency: "ETH",
		explorerUrl: "https://sepolia.blastscan.io",
		rpcUrl: "https://sepolia.blast.io",
		faucetUrl: "https://faucet.quicknode.com/blast/sepolia",
		mintCollectionAddress:
			blastSepoliaContractAddresses["StandardERC721AModule#StandardERC721A"],
		gaslessMintCollectionAddress:
			blastSepoliaContractAddresses["GaslessERC721AModule#GaslessERC721A"],
		soulboundCollectionAddress:
			blastSepoliaContractAddresses["SoulboundERC721AModule#SoulboundERC721A"],
	},
	{
		networkId: "59141",
		networkName: "Linea Sepolia",
		networkUrl: "linea-sepolia",
		currency: "ETH",
		explorerUrl: "https://sepolia.lineascan.build",
		rpcUrl: "https://rpc.sepolia.linea.build",
		faucetUrl: "https://www.covalenthq.com/faucet",
		mintCollectionAddress:
			lineaSepoliaContractAddresses["StandardERC721AModule#StandardERC721A"],
		gaslessMintCollectionAddress:
			lineaSepoliaContractAddresses["GaslessERC721AModule#GaslessERC721A"],
		soulboundCollectionAddress:
			lineaSepoliaContractAddresses["SoulboundERC721AModule#SoulboundERC721A"],
	},
];
