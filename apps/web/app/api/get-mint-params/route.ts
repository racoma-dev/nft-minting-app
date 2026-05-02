import { NextResponse } from "next/server";
import { getMintParams } from "@/lib/server/signature-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
	const { address, quantity, networkId } = await request.json();

	try {
		const mintParams = await getMintParams(address, quantity, networkId);
		return NextResponse.json({
			...mintParams,
			nonce: mintParams.nonce.toString(),
		});
	} catch (error) {
		console.error("Failed to get mint parameters:", error);
		return NextResponse.json(
			{
				error: "Failed to get mint parameters",
				message: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
