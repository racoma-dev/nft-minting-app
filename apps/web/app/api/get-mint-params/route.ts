import { getMintParams } from "@/lib/server/signature-service";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
	try {
		const { address, quantity, networkId } = await request.json();
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
