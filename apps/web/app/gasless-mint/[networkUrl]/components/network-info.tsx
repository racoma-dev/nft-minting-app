import type { FC } from 'react';

interface NetworkInfoProps {
  networkName: string;
}

const NetworkInfo: FC<NetworkInfoProps> = ({ networkName }) => {
  return (
    <>
      <h1 className="font-bold text-4xl mb-5 lg:text-6xl">Alien NFT Collection</h1>
      <p className="text-muted-foreground mb-6">Free NFT Collection on {networkName} without gas</p>
    </>
  );
};

export default NetworkInfo;
