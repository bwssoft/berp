import { updateOneScheduleById } from "@/app/lib/@backend/action"

export async function PATCH(request: Request) {
  const { query, value } = await request.json()

  await updateOneScheduleById(query, value)

  return new Response("ok")
}