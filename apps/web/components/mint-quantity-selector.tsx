"use client";

import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

interface MintQuantitySelectorProps {
	quantity: number;
	setQuantity: (quantity: number | ((prevQuantity: number) => number)) => void;
	isMinting: boolean;
	maxMintAmount: number;
}

export default function MintQuantitySelector({
	quantity,
	setQuantity,
	isMinting,
	maxMintAmount,
}: MintQuantitySelectorProps) {
	const incrementQuantity = () => {
		setQuantity((prevQuantity: number) =>
			prevQuantity < maxMintAmount ? prevQuantity + 1 : prevQuantity,
		);
	};

	const decrementQuantity = () => {
		setQuantity((prevQuantity: number) =>
			prevQuantity > 1 ? prevQuantity - 1 : prevQuantity,
		);
	};

	return (
		<>
			<div className="flex items-center mb-4">
				<h2>Mint Quantity: </h2>
				<Button
					variant="ghost"
					onClick={decrementQuantity}
					disabled={isMinting || quantity <= 1}
				>
					<MinusIcon className="h-5 w-5" />
				</Button>
				<span className="mx-2 w-16 text-center">{quantity}</span>
				<Button
					variant="ghost"
					onClick={incrementQuantity}
					disabled={isMinting || quantity >= maxMintAmount}
				>
					<PlusIcon className="h-5 w-5" />
				</Button>
			</div>
		</>
	);
}
