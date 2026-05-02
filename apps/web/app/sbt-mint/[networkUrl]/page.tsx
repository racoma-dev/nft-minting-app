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
		title: `SBT Mint on ${networkName}`,
		description: `${networkName}のSoul Bound Tokenをミントできます`,
	};
}

export default function Page({ params }: Params) {
	return <MintNetworkContent params={params} />;
}
