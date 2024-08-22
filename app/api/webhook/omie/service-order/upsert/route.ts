import { OmieSaleOrderEvents } from "@/app/lib/@backend/domain/@shared/webhook/omie/omie-sale-order.webhook.interface";
import {
  createSaleOrderFromWebhook,
  deleteSaleOrderFromWebhook,
} from "@/app/lib/@backend/usecase/sale-order/webhook";

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

    if (body.topic === "VendaProduto.Excluida") {
      await deleteSaleOrderFromWebhook.execute({
        body,
      });

      return new Response("Deleted sale order successfully", {
        status: 201,
        statusText: "Sale order deleted successfully",
      });
    }
  } catch (error) {
    console.error(error);
  }
}
