// app/api/export/route.ts
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { getErrorProperties } from "@/app/lib/util/get-error-properties";
import { iteratorToWebStream } from "@/app/lib/util";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: filePath } = await params;
    console.log("Received filePath:", filePath);

    // Validação e sanitização do parâmetro filePath
    if (!filePath || typeof filePath !== "string") {
      console.error("Invalid filePath received:", filePath);
      return new Response(JSON.stringify({ error: "Filepath inválido" }), {
        status: 400,
      });
    }

    // Verifica se o arquivo existe
    if (!fs.existsSync(filePath)) {
      console.error("File does not exist:", filePath);
      return new Response(JSON.stringify({ error: "Arquivo não encontrado" }), {
        status: 404,
      });
    }

    // Define o nome do arquivo para download com base no filepath
    const fileName = path.basename(filePath);
    console.log("fileName:", fileName);

    // Configura os headers para download
    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${fileName}"`);
    headers.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    console.log("Criando read stream para o arquivo:", filePath);
    const fileStream = fs.createReadStream(filePath);

    // Tratamento de erro no stream do arquivo
    fileStream.on("error", (err) => {
      console.error("Erro no fileStream:", err);
    });

    // Converte o Node ReadStream em um async iterator
    const iterator = fileStream[Symbol.asyncIterator]();

    // Converte o iterator em um Web ReadableStream
    const webStream = iteratorToWebStream(iterator);

    // Cria um TransformStream para monitorar os chunks e executar ação no flush
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        console.log(
          "TransformStream recebeu um chunk com tamanho:",
          chunk.length
        );
        controller.enqueue(chunk);
      },
      async flush() {
        console.log("TransformStream flush iniciado para o arquivo:", filePath);
        try {
          await fs.promises.unlink(filePath);
          console.log("Arquivo temporário removido com sucesso:", filePath);
        } catch (err) {
          console.error("Erro ao remover arquivo temporário:", err);
        }
      },
    });

    // Encadeia o webStream ao transformStream
    const finalStream = webStream.pipeThrough(transformStream);
    console.log("Retornando response final com os headers:", headers);

    return new Response(finalStream, { headers });
  } catch (error) {
    console.error("[API ROUTE - EXPORT BY FILEPATH] Erro:", error);
    return new Response(JSON.stringify(getErrorProperties(error)), {
      status: 500,
    });
  }
}
