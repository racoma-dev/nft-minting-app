import type { Metadata } from "next";
import MintTop from "./components/mint-top";

export const metadata: Metadata = {
	title: "Mint",
	description: "ガス代を支払ってERC721のNFTをミントできます",
};

export default function Page() {
	return (
		<>
			<MintTop />
		</>
	);
}
