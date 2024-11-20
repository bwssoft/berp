"use server"
import puppeteer from "puppeteer";
import mustache from "mustache";

export const htmlToPdf = async (
  pdfTemplate: string,
  data: any
): Promise<Uint8Array> => {
  // Renderizar o HTML com Mustache
  const html = mustache.render(pdfTemplate, data);

  // Conectar ao navegador Puppeteer
  const browser = await puppeteer.connect({
    browserWSEndpoint:
      "wss://chrome.browserless.io?token=c8dc96e8-a6c8-4b7c-97e3-5e7977f7389f",
  });

  const page = await browser.newPage();

  // Configurar o conteúdo da página
  await page.setContent(html);

  // Gerar o PDF
  const buffer = await page.pdf({ printBackground: true });

  // Fechar o navegador
  await browser.close();

  return buffer;
};