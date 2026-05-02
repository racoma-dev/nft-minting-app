'use client';

import { MintResultToast } from '@/components/mint-result-toast';
import { networkConfig } from '@/config/network-config';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { notFound } from 'next/navigation';
import { useEffect } from 'react';
import { useContractData } from '../hooks/use-contract-data';
import { useMintState } from '../hooks/use-mint-state';
import MintForm from './mint-form';
import NetworkInfo from './network-info';
import Slideshow from './slide-show';

interface Params {
  params: {
    networkUrl: string;
  };
}

export default function MintNetworkContent({ params }: Params) {
  const { networkUrl } = params;
  const network = networkConfig.find((net) => net.networkUrl === networkUrl);
  const { walletProvider } = useWeb3ModalProvider();

  const {
    quantity,
    setQuantity,
    isMinting,
    setIsMinting,
    currentNetworkId,
    setCurrentNetworkId,
    mintSuccess,
    setMintSuccess,
  } = useMintState();

  const { address } = useWeb3ModalAccount();

  const { maxSupply, totalSupply, remainingMintAmount, error, updateTotalSupply, fetchSupplyData } =
    useContractData(network);

  useEffect(() => {
    if (network && address) {
      fetchSupplyData();
    }
  }, [network, address, fetchSupplyData]);

  if (!network) {
    return null;
  }

  return (
    <>
      <MintResultToast />

      <div className="pb-6 lg:py-40 flex items-center justify-between">
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 w-full lg:pl-8 mt-8 lg:mt-0 flex justify-center order-1">
            <Slideshow />
          </div>

          <div className="lg:w-1/2 w-full lg:pr-8 order-2 mt-8 lg:mt-0 text-center lg:text-left flex flex-col">
            <NetworkInfo networkName={network.networkName} />
            <MintForm
              network={network}
              quantity={quantity}
              setQuantity={setQuantity}
              isMinting={isMinting}
              setIsMinting={setIsMinting}
              maxSupply={maxSupply}
              totalSupply={totalSupply}
              remainingMintAmount={remainingMintAmount}
              error={error}
              currentNetworkId={currentNetworkId}
              setCurrentNetworkId={setCurrentNetworkId}
              updateTotalSupply={updateTotalSupply}
              onMintSuccess={() => setMintSuccess(true)}
              mintSuccess={mintSuccess}
            />
          </div>
        </div>
      </div>
    </>
  );
}
