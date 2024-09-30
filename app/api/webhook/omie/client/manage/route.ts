import { ClientController } from "@/app/lib/@backend/controller/client/client.controller";

export async function POST(request: Request) {
    try {
        const data = await request.json();

        if ("ping" in data) return new Response("Pong", { status: 200 });

        const clientController = new ClientController();
        await clientController.execute(data);
    } finally {
        return Response.json({ message: "Recived message with success!" });
    }
}
