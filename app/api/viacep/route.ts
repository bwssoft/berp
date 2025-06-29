import { getAddressByCep } from "@/app/lib/@backend/action/commercial/address.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const cep = request.nextUrl.searchParams.get("cep") ?? "";
    try {
        const data = await getAddressByCep(cep);
        return NextResponse.json(data);
    } catch (e: any) {
        return new NextResponse(JSON.stringify({ message: e.message }), {
            status: 400,
        });
    }
}
