import { verifyAndMint } from "@/lib/server/signature-service";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
	try {
		const { address, quantity, nonce, expiry, signature, networkId } =
			await request.json();
		const result = await verifyAndMint(
			address,
			quantity,
			nonce,
			expiry,
			signature,
			networkId,
		);

		return NextResponse.json(result);
	} catch (error) {
		console.error("Failed to mint:", error);
		return NextResponse.json(
			{
				error: "Failed to mint",
				message: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
