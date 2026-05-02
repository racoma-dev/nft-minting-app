import Section from '@/app/home/components/section';
import { soulboundERC721AbiMap } from '@/config/abi-map';
import { networkConfig } from '@/config/network-config';
import NetworkCardlist from './network-cardlist';

export default function MintTop() {
  return (
    <Section title="SBT Mint" subTitle="Soul Bound Token Minting of ERC721">
      <div className="grid lg:grid-cols-3 gap-4">
        {networkConfig
          .filter(
            (network) =>
              network.gaslessMintCollectionAddress && soulboundERC721AbiMap[network.networkId]
          )
          .map((network) => (
            <NetworkCardlist key={network.networkId} network={network} />
          ))}
      </div>
    </Section>
  );
}
