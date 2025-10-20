import { NextRequest, NextResponse } from "next/server";
import { inactivatePriceTableUsecase } from "@/backend/usecase/commercial/price-table/inactivate.price-table.usecase";
import { priceTableRepository } from "@/backend/infra";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // const secret = req.headers.get("x-webhook-secret");
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

  const { priceTableId } = (body ?? {}) as { priceTableId?: string };
  if (!priceTableId) {
    return NextResponse.json(
      { ok: false, error: "missing id" },
      { status: 400 }
    );
  }

  const out = await inactivatePriceTableUsecase.execute({ id: priceTableId });

  if (!out.success) {
    return NextResponse.json(
      { ok: false, error: out.error },
      { status: 400 }
    );
  }

  try {
    const inactivated = await priceTableRepository.findOne({ id: priceTableId });

    if (inactivated?.isTemporary) {
      const pausedNormal = await priceTableRepository.findOne({
        isTemporary: false,
        status: "PAUSED",
      });

      if (pausedNormal?.id) {
        await priceTableRepository.updateOne(
          { id: pausedNormal.id },
          { $set: { status: "ACTIVE", updated_at: new Date() } }
        );
      }
    }
  } catch (error) {
    console.warn(
      "Failed to activate paused normal price table after webhook inactivation:",
      error
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
