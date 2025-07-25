// app/api/firmware-update-log/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import type { IFirmwareUpdateLog } from "@/app/lib/@backend/domain";
import { createManyFirmwareUpdateLogUsecase } from "@/app/lib/@backend/usecase/production/firmware-update-log/create-many-firmware-update-log.usecase";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // aqui você importa o tipo diretamente
  const input: Omit<IFirmwareUpdateLog, "id" | "created_at" | "user">[] =
    await req.json();

  const data = input.map((i) => ({
    ...i,
    user: {
      id: session.user.id,
      name: session.user.name!,
      email: session.user.email!,
    },
  }));

  const result = await createManyFirmwareUpdateLogUsecase.execute(data);
  return NextResponse.json(result);
}
