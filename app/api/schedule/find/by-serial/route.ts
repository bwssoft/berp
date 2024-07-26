import { findManyPendingScheduleBySerial } from "@/app/lib/@backend/action"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const serial = searchParams.get('serial')

  if (!serial) return new Response('No serial in searchParams', { status: 400 })

  const schedules = await findManyPendingScheduleBySerial(serial)

  return Response.json({ schedules })
}