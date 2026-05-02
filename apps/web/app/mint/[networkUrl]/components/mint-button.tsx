'use client';

import { showMintErrorToast, showMintSuccessToast } from '@/components/mint-result-toast';
import { Button } from '@/components/ui/button';
import { standardERC721AbiMap } from '@/config/abi-map';
import { networkConfig } from '@/config/network-config';
import { useSwitchNetwork, useWeb3Modal, useWeb3ModalProvider } from '@web3modal/ethers/react';
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
}: MintButtonProps) {
  const { walletProvider } = useWeb3ModalProvider(); // Web3Modalによるウォレット接続情報を取得
  const { switchNetwork } = useSwitchNetwork(); // ネットワーク切り替え用のフックを取得
  const web3Modal = useWeb3Modal(); // Web3Modalインスタンスを取得
  const [isNetworkSwitching, setIsNetworkSwitching] = useState(false); // ネットワーク切り替え中かどうかを示すフラグ
  const [initialMintAttempted, setInitialMintAttempted] = useState(false); // 初回ミント試行フラグ
  const network = networkConfig.find(
    (net) => net.networkName.toLowerCase().replace(/ /g, '-') === networkName
  );
  const contractAddress = network?.mintCollectionAddress; // コントラクトアドレスを取得
  const contractModule = standardERC721AbiMap[networkId]; // コントラクトabiを取得

  const handleMint = useCallback(async () => {
    if (!walletProvider) {
      console.error('No wallet provider found');
      // ウォレット接続がない場合、web3Modalを開いて接続を促す
      await web3Modal.open();
      setInitialMintAttempted(true);
      return;
    }

    if (initialMintAttempted) {
      setInitialMintAttempted(false);
    }

    setIsMinting(true);

    try {
      // 現在のネットワークを取得
      let provider = new ethers.BrowserProvider(walletProvider);
      let network = await provider.getNetwork();

      // ネットワークが異なる場合、ネットワークを切り替える
      if (network.chainId !== BigInt(networkId)) {
        console.log(`Switching network to ${networkId}`);
        setIsNetworkSwitching(true);

        // タイムアウト用のPromise
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Network switch timed out')), 30000)
        );

        // ネットワーク切り替えとタイムアウトの競合
        await Promise.race([
          (async () => {
            await switchNetwork(Number.parseInt(networkId, 10));
            // ネットワークが切り替わるのを待つ
            while (network.chainId !== BigInt(networkId)) {
              provider = new ethers.BrowserProvider(walletProvider);
              network = await provider.getNetwork();
            }
          })(),
          // 30秒間ネットワーク切り替えが行われなかった場合はエラーとして処理
          timeoutPromise,
        ]);

        setCurrentNetworkId(networkId);
        setIsNetworkSwitching(false);
      }

      // ミントに必要な情報を取得
      const signer = await provider.getSigner();

      if (!contractModule || !contractAddress) {
        console.error('No ABI or contract address found for the specified network');
        setIsMinting(false);
        return;
      }

      // ミントを実行
      const contract = new ethers.Contract(contractAddress, contractModule.abi, signer);
      const tx = await contract.mint(quantity);
      console.log('Minted NFT:', tx);
      await tx.wait();
      await updateTotalSupply(); // Total Supplyを更新
      showMintSuccessToast(); // 成功時のトースト
      onMintSuccess();
    } catch (error) {
      console.error('Minting failed:', error);
      showMintErrorToast(); // 失敗時のトースト
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

  // ウォレット接続後に自動的にミントフローを実行
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
      : isMinting
      ? 'Minting...'
      : 'Mint';

  return (
    <Button
      onClick={handleMint}
      disabled={isLoading || isSoldOut || !contractAddress || !contractModule}
      className="w-[400px] lg:w-[500px]"
      size={'lg'}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {buttonLabel}
    </Button>
  );
}
