import MaxMintAmountDisplay from "@/app/mint/[networkUrl]/components/max-mint-amount-display";
import MintQuantitySelector from "@/components/mint-quantity-selector";
import SupplyDisplay from "@/components/supply-display";
import { Button } from "@/components/ui/button";
import type { NetworkConfig } from "@/config/network-config";
import { faGasPump } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import MintButton from "./mint-button";

interface MintFormProps {
	network: NetworkConfig;
	quantity: number;
	setQuantity: (quantity: number | ((prevQuantity: number) => number)) => void;
	isMinting: boolean;
	setIsMinting: (isMinting: boolean) => void;
	maxSupply: number | null;
	totalSupply: number | null;
	maxMintAmount: number | null;
	error: string | null;
	currentNetworkId: string | null;
	setCurrentNetworkId: (networkId: string) => void;
	updateTotalSupply: () => Promise<void>;
	onMintSuccess: () => void;
	mintSuccess: boolean;
}

const MintForm: FC<MintFormProps> = ({
	network,
	quantity,
	setQuantity,
	isMinting,
	setIsMinting,
	maxSupply,
	totalSupply,
	maxMintAmount,
	error,
	currentNetworkId,
	setCurrentNetworkId,
	updateTotalSupply,
	onMintSuccess,
	mintSuccess,
}) => {
	const isSoldOut =
		maxSupply !== null && totalSupply !== null && totalSupply >= maxSupply;

	return (
		<>
			<div className="flex justify-center lg:justify-start mb-6 text-primary">
				{!error && (
					<div className="bg-primary-foreground py-2 px-4 rounded-lg mr-4 shadow-inner">
						<MaxMintAmountDisplay maxMintAmount={maxMintAmount} />
					</div>
				)}
				<SupplyDisplay
					maxSupply={maxSupply}
					totalSupply={totalSupply}
					error={error}
				/>
			</div>

			<div className="flex justify-center lg:justify-start mb-2">
				<MintQuantitySelector
					quantity={quantity}
					setQuantity={setQuantity}
					isMinting={isMinting}
					maxMintAmount={maxMintAmount || 1}
				/>
			</div>

			<div className="flex justify-center lg:justify-start">
				{!mintSuccess ? (
					<MintButton
						networkName={network.networkUrl}
						networkId={network.networkId}
						quantity={quantity}
						isMinting={isMinting}
						setIsMinting={setIsMinting}
						isSoldOut={isSoldOut}
						currentNetworkId={currentNetworkId}
						setCurrentNetworkId={setCurrentNetworkId}
						updateTotalSupply={updateTotalSupply}
						onMintSuccess={onMintSuccess}
					/>
				) : (
					<Link
						href="https://testnets.opensea.io/account"
						target="_blank"
						rel="noopener noreferrer"
						className="w-full flex justify-center lg:justify-start"
					>
						<Button className="w-[400px] lg:w-[500px]" size={"lg"}>
							<Image
								src="/image/opensea-logo.png"
								alt="opensea"
								width={20}
								height={20}
								className="mr-2"
							/>
							Check your NFT on OpenSea
						</Button>
					</Link>
				)}
			</div>

			{network.faucetUrl && (
				<div className="flex justify-center lg:justify-start mt-6">
					<Link
						href={network.faucetUrl as string}
						target="_blank"
						rel="noopener noreferrer"
					>
						<FontAwesomeIcon icon={faGasPump} className="mr-2" />
						Get Gas Fee
					</Link>
				</div>
			)}
		</>
	);
};

export default MintForm;
