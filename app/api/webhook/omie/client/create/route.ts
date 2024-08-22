import { ClientController } from "@/app/lib/@backend/controller/client/client.controller";

export async function POST(request: Request) {
  const data = await request.json();
  const clientController = new ClientController();
  await clientController.execute(data);

  return Response.json({ message: "Recived message with success!" })
}