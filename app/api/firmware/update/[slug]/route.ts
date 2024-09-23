import { findOneDevice } from "@/app/lib/@backend/action"
import { createOneRequestToUpdateUsecase, downloadFirmwareFile, findOneDeviceUsecase } from "@/app/lib/@backend/usecase"
import { getErrorProperties } from "@/app/lib/util/get-error-properties"

export async function GET(request: Request, { params }: { params: { slug: string } }
) {
  try {
    const firmware_name_on_url = params.slug

    const serial = request.headers.get("imei")

    if (!serial) return new Response("Serial not found", { status: 404 })

    const device = await findOneDeviceUsecase.execute({ serial })

    if (!device) return new Response("Device not found", { status: 404 })

    const file = await downloadFirmwareFile.execute(firmware_name_on_url)

    if (!file) return new Response("Firmware not found", { status: 404 })

    const { stream, firmware } = file

    const new_stream = new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk);
      },
      async flush() {
        const request_to_update = {
          device_id: device.id,
          firmware_id: firmware.id
        }
        await createOneRequestToUpdateUsecase.execute(request_to_update)
      }
    })



    return new Response(stream.pipeThrough(new_stream), {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename=${firmware.file.name}`
      },
    })
  } catch (e) {
    return new Response(JSON.stringify(getErrorProperties(e), null, 2), { status: 500 })
  }
}