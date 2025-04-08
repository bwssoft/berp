// Função que converte um async iterator em um Web ReadableStream
export function iteratorToWebStream<T>(
  iterator: AsyncIterator<T>
): ReadableStream<T> {
  return new ReadableStream({
    async pull(controller) {
      try {
        const { value, done } = await iterator.next();
        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
        }
      } catch (error) {
        controller.error(error);
      }
    },
    cancel(reason) {
      if (typeof iterator.return === "function") {
        iterator.return();
      }
    },
  });
}
