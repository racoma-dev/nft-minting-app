"use client";

import { Loader2 } from "lucide-react";

interface RemainingMintAmountDisplayProps {
	remainingMintAmount: number | null;
}

export default function RemainingMintAmountDisplay({
	remainingMintAmount,
}: RemainingMintAmountDisplayProps) {
	return (
		<>
			{remainingMintAmount !== null ? (
				<p>{`Remaining Mint Amount: ${remainingMintAmount}`}</p>
			) : (
				<div className="flex items-center">
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					<p>Loading remaining mint amount...</p>
				</div>
			)}
		</>
	);
}
