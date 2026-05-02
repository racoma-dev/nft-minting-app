import { useState } from "react";

export function useMintState() {
	const [quantity, setQuantity] = useState<number>(1);
	const [isMinting, setIsMinting] = useState(false);
	const [currentNetworkId, setCurrentNetworkId] = useState<string | null>(null);
	const [mintSuccess, setMintSuccess] = useState(false);

	return {
		quantity,
		setQuantity: setQuantity as (
			quantity: number | ((prevQuantity: number) => number),
		) => void,
		isMinting,
		setIsMinting,
		currentNetworkId,
		setCurrentNetworkId,
		mintSuccess,
		setMintSuccess,
	};
}
