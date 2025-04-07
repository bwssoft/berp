// Função que converte um async iterator em um Web ReadableStream
export function iteratorToWebStream<T>(
  iterator: AsyncIterator<T>
): ReadableStream<T> {
  return new ReadableStream({
    async pull(controller) {
      try {
        const { value, done } = await iterator.next();
        if (done) {
          console.log("Iterator finalizado, fechando stream.");
          controller.close();
        } else {
          console.log("Iterator retornou um chunk.");
          controller.enqueue(value);
        }
      } catch (error) {
        console.error("Erro durante o pull do iterator:", error);
        controller.error(error);
      }
    },
    cancel(reason) {
      console.log("ReadableStream cancelado. Motivo:", reason);
      if (typeof iterator.return === "function") {
        iterator.return();
      }
    },
  });
}
