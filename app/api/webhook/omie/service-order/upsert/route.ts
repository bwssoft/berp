import { SaleOrderController } from "@/app/lib/@backend/controller/sale-order/sale-order.controller";
import { OmieSaleOrderEvents } from "@/app/lib/@backend/domain/@shared/webhook/omie/omie-sale-order.webhook.interface";

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as OmieSaleOrderEvents[keyof OmieSaleOrderEvents];

    const saleOrderController = new SaleOrderController();

    await saleOrderController.execute(body);

    return new Response("Sale order processed successfully", { status: 200 });
  } catch (error) {
    console.error(error);
  }
}
