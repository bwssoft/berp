import { SaleOrderController } from "@/app/lib/@backend/controller/sale-order/sale-order.controller";
import { OmieSaleOrderEvents } from "@/app/lib/@backend/domain/@shared/webhook/omie/omie-sale-order.webhook.interface";

export async function POST(request: Request) {
  try {
    let body = await request.json() as OmieSaleOrderEvents[keyof OmieSaleOrderEvents];

    if ("ping" in body) return new Response("Pong", { status: 200 })

    const saleOrderController = new SaleOrderController();

    await saleOrderController.execute(body);

    return new Response("Sale order processed successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("Error", { status: 500 });

  }
}
