export function getRandomHexColor(): string {
  // Função auxiliar para converter um número em hexadecimal com dois dígitos
  const componentToHex = (c: number): string => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  // Gerar valores aleatórios para R, G e B
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  // Concatenar e retornar a cor em formato hexadecimal
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Exemplo de uso
