// app/api/firmware-update-log/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import type {IIdentificationLog} from "@/app/lib/@backend/domain/production/entity/identification-log.definition";
import {createOneIdentificationLogUsecase} from "@/app/lib/@backend/usecase/production/identification-log/create-one-identification-log.usecase";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // aqui você importa o tipo diretamente
  const input: Omit<IIdentificationLog, "id" | "created_at" | "user"> =
    await req.json();

  const data = {
    ...input,
    user: {
      id: session.user.id,
      name: session.user.name!,
      email: session.user.email!,
    },
  };

  const result = await createOneIdentificationLogUsecase.execute(data);
  return NextResponse.json(result);
}
