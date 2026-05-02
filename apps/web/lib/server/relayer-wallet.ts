import { ethers } from "ethers";

export const getRelayerWallet = () => {
	const privateKey = process.env.RELAYER_PRIVATE_KEY;
	if (!privateKey) {
		throw new Error("RELAYER_PRIVATE_KEY is not set in environment variables");
	}
	return new ethers.Wallet(privateKey);
};
