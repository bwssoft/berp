import { OmieSaleOrderEvents } from "@/app/lib/@backend/domain/@shared/webhook/omie/omie-sale-order.webhook.interface";
import { createSaleOrderFromWebhook } from "@/app/lib/@backend/usecase/sale-order/webhook/create-sale-order-from-webhook.usecase";

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as OmieSaleOrderEvents[keyof OmieSaleOrderEvents];

    if (body.topic === "VendaProduto.Incluida") {
      const createdSaleOrder = await createSaleOrderFromWebhook.execute({
        body,
      });

      if (createdSaleOrder) {
        return new Response(JSON.stringify(createdSaleOrder), {
          status: 201,
          statusText: "Sale order created successfully",
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response("Error creating sale order from webhook", {
          status: 400,
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
}
