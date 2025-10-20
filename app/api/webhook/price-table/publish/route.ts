import { NextRequest, NextResponse } from "next/server";
import { activatePriceTableUsecase } from "@/backend/usecase/commercial/price-table/active.price-table.usecase";
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
      { ok: false, error: "missing priceTableId" },
      { status: 400 }
    );
  }

  const priceTable = await priceTableRepository.findOne({ id: priceTableId });
  if (!priceTable) {
    return NextResponse.json(
      { ok: false, error: { global: "Tabela de preços não encontrada." } },
      { status: 404 }
    );
  }

  if (!priceTable.isTemporary) {
    try {
      const activeNormal = await priceTableRepository.findOne({
        id: { $ne: priceTableId },
        isTemporary: false,
        status: "ACTIVE",
      });

      if (activeNormal?.id) {
        await priceTableRepository.updateOne(
          { id: activeNormal.id },
          { $set: { status: "INACTIVE", updated_at: new Date() } }
        );
      }
    } catch (error) {
      console.warn(
        "Failed to inactivate currently active normal price table before activation webhook:",
        error
      );
    }
  }

  const out = await activatePriceTableUsecase.execute({ id: priceTableId });
  return NextResponse.json(
    { ok: out.success, error: out.error },
    { status: out.success ? 200 : 400 }
  );
}
