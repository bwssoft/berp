import { updateBulkSchedule } from "@/app/lib/@backend/action"

export async function PATCH(request: Request) {
  // const { operations } = await request.json()

  // if (!operations || !operations.length) return new Response(
  //   "No 'operations' on query",
  //   { status: 400 }
  // )

  // await updateBulkSchedule(operations)

  return Response.json({ ok: true })
}