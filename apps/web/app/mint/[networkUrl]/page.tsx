import { networkConfig } from "@/config/network-config";
import type { Metadata } from "next";
import MintNetworkContent from "./components/mint-network-content";

interface Params {
	params: {
		networkUrl: string;
	};
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { networkUrl } = params;
	const network = networkConfig.find((net) => net.networkUrl === networkUrl);

	const networkName = network ? network.networkName : "Unknown network";

	return {
		title: `Mint on ${networkName}`,
		description: `ガス代を支払って${networkName}のERC721 NFTをミントできます`,
	};
}

export default function Page({ params }: Params) {
	return <MintNetworkContent params={params} />;
}
