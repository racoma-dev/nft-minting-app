"use client";

import { Loader2 } from "lucide-react";

interface SupplyDisplayProps {
	maxSupply: number | null;
	totalSupply: number | null;
	error: string | null;
}

export default function SupplyDisplay({
	maxSupply,
	totalSupply,
	error,
}: SupplyDisplayProps) {
	return (
		<>
			{maxSupply !== null && totalSupply !== null ? (
				<div className="bg-primary-foreground py-2 px-4 rounded-lg shadow-inner">
					<p>{`Total Supply: ${totalSupply} / ${maxSupply}`}</p>
				</div>
			) : error ? (
				<div className="bg-primary-foreground py-2 px-4 rounded-lg shadow-inner">
					<p>{error}</p>
				</div>
			) : (
				<div className="bg-primary-foreground py-2 px-4 rounded-lg shadow-inner flex items-center">
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					<p>Loading supply data...</p>
				</div>
			)}
		</>
	);
}
