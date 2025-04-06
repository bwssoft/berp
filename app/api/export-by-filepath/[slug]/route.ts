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
    const { slug: filePath } = await params; // 'a', 'b', or 'c'

    // Validação e sanitização do parâmetro filePath
    if (!filePath || typeof filePath !== "string") {
      return new Response(JSON.stringify({ error: "Filepath inválido" }), {
        status: 400,
      });
    }

    // Define o nome do arquivo para download com base no filepath
    const fileName = path.basename(filePath);
    console.log("fileName", fileName);
    // Configura os headers para download
    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${fileName}"`);
    headers.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Cria o stream do arquivo usando fs.createReadStream (Node ReadStream)
    const fileStream = fs.createReadStream(filePath);

    // Converte o Node ReadStream em um async iterator
    const iterator = fileStream[Symbol.asyncIterator]();

    // Converte o iterator em um Web ReadableStream
    const webStream = iteratorToWebStream(iterator);

    // Cria um TransformStream para executar uma ação no flush (ex: remover o arquivo)
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk);
      },
      async flush() {
        fs.unlink(filePath, (err) => {
          if (err) console.error("Erro ao remover arquivo temporário:", err);
        });
      },
    });

    // Encadeia o webStream ao transformStream
    const finalStream = webStream.pipeThrough(transformStream);
    console.log("return");
    return new Response(finalStream, { headers });
  } catch (error) {
    console.error("[API ROUTE - EXPORT BY FILEPATH]", error);
    return new Response(JSON.stringify(getErrorProperties(error)), {
      status: 500,
    });
  }
}
