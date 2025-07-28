import { toast } from "../@frontend/hook/use-toast";

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Sucesso!",
      description: "Copiado para a área de transferência.",
    });
  } catch (error) {
    toast({
      title: "Erro",
      description: "Não foi possível copiar.",
      variant: "error",
    });
  }
}