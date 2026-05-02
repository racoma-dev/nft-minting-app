"use client";

import { Toaster, toast } from "sonner";

export function MintResultToast() {
	return <Toaster richColors position="bottom-right" closeButton />;
}

export function showMintSuccessToast() {
	toast.success("Minting completed successfully!");
}

export function showMintErrorToast() {
	toast.error("Minting failed. Please try again.");
}
