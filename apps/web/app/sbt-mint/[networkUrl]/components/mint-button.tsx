'use client';

import { showMintErrorToast, showMintSuccessToast } from '@/components/mint-result-toast';
import { Button } from '@/components/ui/button';
import { soulboundERC721AbiMap } from '@/config/abi-map';
import { networkConfig } from '@/config/network-config';
import {
  useSwitchNetwork,
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from '@web3modal/ethers/react';
import { ethers } from 'ethers';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface MintButtonProps {
  networkName: string;
  networkId: string;
  quantity: number;
  isMinting: boolean;
  setIsMinting: (isMinting: boolean) => void;
  isSoldOut: boolean;
  currentNetworkId: string | null;
  setCurrentNetworkId: (networkId: string) => void;
  updateTotalSupply: () => Promise<void>;
  onMintSuccess: () => void;
  remainingMintAmount: number | null;
}

export default function MintButton({
  networkName,
  networkId,
  quantity,
  isMinting,
  setIsMinting,
  isSoldOut,
  setCurrentNetworkId,
  updateTotalSupply,
  onMintSuccess,
  remainingMintAmount,
}: MintButtonProps) {
  const { walletProvider } = useWeb3ModalProvider();
  const { switchNetwork } = useSwitchNetwork();
  const web3Modal = useWeb3Modal();
  const { address } = useWeb3ModalAccount();
  const [isNetworkSwitching, setIsNetworkSwitching] = useState(false);
  const [initialMintAttempted, setInitialMintAttempted] = useState(false);
  const network = networkConfig.find(
    (net) => net.networkName.toLowerCase().replace(/ /g, '-') === networkName
  );
  const contractAddress = network?.soulboundCollectionAddress;
  const contractModule = soulboundERC721AbiMap[networkId];

  const handleMint = useCallback(async () => {
    if (!walletProvider) {
      console.error('No wallet provider found');
      await web3Modal.open();
      setInitialMintAttempted(true);
      return;
    }

    if (initialMintAttempted) {
      setInitialMintAttempted(false);
    }

    setIsMinting(true);

    try {
      let provider = new ethers.BrowserProvider(walletProvider);
      let currentNetwork = await provider.getNetwork();

      if (currentNetwork.chainId !== BigInt(networkId)) {
        console.log(`Switching network to ${networkId}`);
        setIsNetworkSwitching(true);

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Network switch timed out')), 30000)
        );

        await Promise.race([
          (async () => {
            await switchNetwork(Number.parseInt(networkId, 10));
            while (currentNetwork.chainId !== BigInt(networkId)) {
              provider = new ethers.BrowserProvider(walletProvider);
              currentNetwork = await provider.getNetwork();
            }
          })(),
          timeoutPromise,
        ]);

        setCurrentNetworkId(networkId);
        setIsNetworkSwitching(false);
      }

      const signer = await provider.getSigner();

      if (!contractModule || !contractAddress) {
        console.error('No ABI or contract address found for the specified network');
        setIsMinting(false);
        return;
      }

      const contract = new ethers.Contract(contractAddress, contractModule.abi, signer);
      const tx = await contract.mint(quantity);
      console.log('Minted NFT:', tx);
      await tx.wait();
      await updateTotalSupply();
      showMintSuccessToast();
      onMintSuccess();
    } catch (error) {
      console.error('Minting failed:', error);
      showMintErrorToast();
    } finally {
      setIsMinting(false);
      setIsNetworkSwitching(false);
    }
  }, [
    walletProvider,
    web3Modal,
    networkId,
    quantity,
    switchNetwork,
    updateTotalSupply,
    setCurrentNetworkId,
    setIsMinting,
    initialMintAttempted,
    contractAddress,
    contractModule,
    onMintSuccess,
  ]);

  useEffect(() => {
    if (walletProvider && initialMintAttempted) {
      handleMint();
    }
  }, [walletProvider, handleMint, initialMintAttempted]);

  const isLoading = isMinting || isNetworkSwitching;
  const buttonLabel =
    !contractAddress || !contractModule
      ? 'Not Available'
      : isSoldOut
      ? 'Sold Out'
      : remainingMintAmount === 0
      ? 'No More Mints Available'
      : isMinting
      ? 'Minting...'
      : 'Mint';

  const isDisabled = isLoading || isSoldOut || !contractAddress || remainingMintAmount === 0;

  return (
    <Button
      onClick={handleMint}
      disabled={isDisabled}
      className="w-[400px] lg:w-[500px]"
      size={'lg'}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {buttonLabel}
    </Button>
  );
}
