import { ethers } from "ethers";
import gaslessERC721A_59141 from "../../../../contract/ignition/deployments/chain-59141/artifacts/GaslessERC721AModule#GaslessERC721A.json";
import lineaSepoliaContractAddresses from "../../../../contract/ignition/deployments/chain-59141/deployed_addresses.json";
import gaslessERC721A_80002 from "../../../../contract/ignition/deployments/chain-80002/artifacts/GaslessERC721AModule#GaslessERC721A.json";
import amoyContractAddresses from "../../../../contract/ignition/deployments/chain-80002/deployed_addresses.json";
import gaslessERC721A_84532 from "../../../../contract/ignition/deployments/chain-84532/artifacts/GaslessERC721AModule#GaslessERC721A.json";
import baseSepoliaContractAddresses from "../../../../contract/ignition/deployments/chain-84532/deployed_addresses.json";
import gaslessERC721A_421614 from "../../../../contract/ignition/deployments/chain-421614/artifacts/GaslessERC721AModule#GaslessERC721A.json";
import arbitrumSepoliaContractAddresses from "../../../../contract/ignition/deployments/chain-421614/deployed_addresses.json";
import gaslessERC721A_11155111 from "../../../../contract/ignition/deployments/chain-11155111/artifacts/GaslessERC721AModule#GaslessERC721A.json";
import sepoliaContractAddresses from "../../../../contract/ignition/deployments/chain-11155111/deployed_addresses.json";
import gaslessERC721A_11155420 from "../../../../contract/ignition/deployments/chain-11155420/artifacts/GaslessERC721AModule#GaslessERC721A.json";
import optimismSepoliaContractAddresses from "../../../../contract/ignition/deployments/chain-11155420/deployed_addresses.json";
import gaslessERC721A_168587773 from "../../../../contract/ignition/deployments/chain-168587773/artifacts/GaslessERC721AModule#GaslessERC721A.json";
import blastSepoliaContractAddresses from "../../../../contract/ignition/deployments/chain-168587773/deployed_addresses.json";
import { getRelayerWallet } from "./relayer-wallet";

export const gaslessERC721AbiMap: { [key: string]: any } = {
	"11155111": {
		abi: gaslessERC721A_11155111.abi,
		address: sepoliaContractAddresses["GaslessERC721AModule#GaslessERC721A"],
		rpcUrl: "https://11155111.rpc.thirdweb.com",
	},
	"80002": {
		abi: gaslessERC721A_80002.abi,
		address: amoyContractAddresses["GaslessERC721AModule#GaslessERC721A"],
		rpcUrl: "https://80002.rpc.thirdweb.com",
	},
	"11155420": {
		abi: gaslessERC721A_11155420.abi,
		address:
			optimismSepoliaContractAddresses["GaslessERC721AModule#GaslessERC721A"],
		rpcUrl: "https://sepolia.optimism.io",
	},
	"421614": {
		abi: gaslessERC721A_421614.abi,
		address:
			arbitrumSepoliaContractAddresses["GaslessERC721AModule#GaslessERC721A"],
		rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
	},
	"84532": {
		abi: gaslessERC721A_84532.abi,
		address:
			baseSepoliaContractAddresses["GaslessERC721AModule#GaslessERC721A"],
		rpcUrl: "https://sepolia.base.org",
	},
	"168587773": {
		abi: gaslessERC721A_168587773.abi,
		address:
			blastSepoliaContractAddresses["GaslessERC721AModule#GaslessERC721A"],
		rpcUrl: "https://sepolia.blast.io",
	},
	"59141": {
		abi: gaslessERC721A_59141.abi,
		address:
			lineaSepoliaContractAddresses["GaslessERC721AModule#GaslessERC721A"],
		rpcUrl: "https://rpc.sepolia.linea.build",
	},
};

export function isSupportedNetwork(networkId: string): boolean {
	return networkId in gaslessERC721AbiMap;
}

function validateMintInput(signer: string, quantity: number) {
	if (!ethers.isAddress(signer)) {
		throw new Error(`Invalid signer address: ${signer}`);
	}

	if (!Number.isInteger(quantity) || quantity <= 0) {
		throw new Error(`Invalid quantity: ${quantity}`);
	}
}

export const getMintParams = async (
	signer: string,
	quantity: number,
	networkId: string,
) => {
	validateMintInput(signer, quantity);

	if (!isSupportedNetwork(networkId)) {
		throw new Error(`Unsupported network: ${networkId}`);
	}

	const networkConfig = gaslessERC721AbiMap[networkId];
	if (!networkConfig || !networkConfig.address) {
		throw new Error(`Contract address not found for network: ${networkId}`);
	}

	const relayerWallet = getRelayerWallet();
	const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
	const contract = new ethers.Contract(
		networkConfig.address,
		networkConfig.abi,
		provider,
	);

	const nonce = await contract.getNonce(signer);
	const expiry = Math.floor(Date.now() / 1000) + 3600;

	const messageToSign = ethers.solidityPackedKeccak256(
		["address", "address", "uint256", "uint256", "uint256", "address"],
		[
			relayerWallet.address,
			signer,
			quantity,
			nonce,
			expiry,
			networkConfig.address,
		],
	);

	return {
		nonce: nonce.toString(),
		expiry,
		messageToSign: ethers.hexlify(messageToSign),
	};
};

export const verifyAndMint = async (
	signer: string,
	quantity: number,
	nonce: string,
	expiry: number,
	signature: string,
	networkId: string,
) => {
	validateMintInput(signer, quantity);

	if (!isSupportedNetwork(networkId)) {
		throw new Error(`Unsupported network: ${networkId}`);
	}

	const relayerWallet = getRelayerWallet();
	const provider = new ethers.JsonRpcProvider(
		gaslessERC721AbiMap[networkId].rpcUrl,
	);
	const connectedRelayerWallet = relayerWallet.connect(provider);
	const abi = gaslessERC721AbiMap[networkId].abi;
	const contractAddress = gaslessERC721AbiMap[networkId].address;
	const contract = new ethers.Contract(
		contractAddress,
		abi,
		connectedRelayerWallet,
	);

	const messageHash = ethers.solidityPackedKeccak256(
		["address", "address", "uint256", "uint256", "uint256", "address"],
		[
			relayerWallet.address,
			signer,
			quantity,
			BigInt(nonce),
			expiry,
			contractAddress,
		],
	);

	const recoveredAddress = ethers.verifyMessage(
		ethers.getBytes(messageHash),
		signature,
	);

	if (recoveredAddress.toLowerCase() !== signer.toLowerCase()) {
		throw new Error(
			`Invalid signature. Expected: ${signer}, Got: ${recoveredAddress}`,
		);
	}

	const tx = await contract.gaslessMint(
		signer,
		quantity,
		BigInt(nonce),
		expiry,
		signature,
	);
	const receipt = await tx.wait();

	return {
		transactionHash: receipt.hash,
		blockNumber: receipt.blockNumber.toString(),
	};
};
