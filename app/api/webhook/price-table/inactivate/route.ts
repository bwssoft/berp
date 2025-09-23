import { NextRequest, NextResponse } from "next/server";
import { inactivatePriceTableUsecase } from "@/app/lib/@backend/usecase/commercial/price-table/inactivate.price-table.usecase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-webhook-secret");
  // if (secret !== process.env._____) {
  //   return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  // }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid json" },
      { status: 400 }
    );
  }

  const { id } = (body ?? {}) as { id?: string };
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "missing id" },
      { status: 400 }
    );
  }

  const out = await inactivatePriceTableUsecase.execute({ id });
  return NextResponse.json(
    { ok: out.success, error: out.error },
    { status: out.success ? 200 : 400 }
  );
}
