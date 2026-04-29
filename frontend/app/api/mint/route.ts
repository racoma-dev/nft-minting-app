import { NextResponse } from "next/server";
import { verifyAndMint } from "@/lib/server/signature-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
	const { address, quantity, nonce, expiry, signature, networkId } =
		await request.json();

	try {
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
