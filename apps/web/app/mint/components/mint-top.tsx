import Section from "@/app/home/components/section";
import { standardERC721AbiMap } from "@/config/abi-map";
import { networkConfig } from "@/config/network-config";
import NetworkCardlist from "./network-cardlist";

export default function MintTop() {
	return (
		<Section title="Mint" subTitle="NFT Minting of ERC721">
			<div className="grid lg:grid-cols-3 gap-4">
				{networkConfig
					.filter(
						(network) =>
							network.mintCollectionAddress &&
							standardERC721AbiMap[network.networkId],
					)
					.map((network) => (
						<NetworkCardlist key={network.networkId} network={network} />
					))}
			</div>
		</Section>
	);
}
