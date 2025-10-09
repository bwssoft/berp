// app/api/firmware-update-log/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import type {IAutoTestLog} from "@/app/lib/@backend/domain/production/entity/auto-test-log.definition";
import {createManyAutoTestLogUsecase} from "@/app/lib/@backend/usecase/production/auto-test-log/create-many-auto-test-log.usecase";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // aqui você importa o tipo diretamente
  const input: Omit<IAutoTestLog, "id" | "created_at" | "user">[] =
    await req.json();

  const data = input.map((i) => ({
    ...i,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    },
  }));

  const result = await createManyAutoTestLogUsecase.execute(data);
  return NextResponse.json(result);
}
