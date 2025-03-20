export function getRandomNumber(min: number, max: number): number {
  if (min >= max) {
    throw new Error("O valor mínimo deve ser menor que o máximo.");
  }

  const range = max - min;
  const array = new Uint32Array(1);

  // Preenche o array com um número aleatório seguro
  crypto.getRandomValues(array);

  // Normaliza o número para ficar dentro do intervalo desejado
  return min + (array[0] / (0xffffffff + 1)) * range;
}

export function getRandomInt(min: number, max: number): number {
  if (min >= max) {
    throw new Error("O valor mínimo deve ser menor que o máximo.");
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
