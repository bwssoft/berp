import { updateManyScheduleById } from "@/app/lib/@backend/action"

export async function PATCH(request: Request) {
  const { query, value } = await request.json()

  if (!("id" in query)) return new Response(
    "No 'id' on query",
    { status: 400 }
  )

  if (!("pending" in value)) return new Response(
    "No 'pending' on value",
    { status: 400 }
  )

  await updateManyScheduleById(query, value)

  return Response.json({ ok: true })
}