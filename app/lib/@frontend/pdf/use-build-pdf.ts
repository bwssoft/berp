"use client";
import { compile } from "@fileforge/react-print";
import { ReactElement } from "react";

export function useBuildPdf(template: ReactElement) {
  async function download() {
    const html = await compile(template);

    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.open();

      printWindow.document.write(`
        <html>
          <head>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          
          <body>
            ${html}
          </body>
        </html>
      `);

      printWindow.document.close();

      // Wait for the content to load and then call the print function
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  }

  return {
    download,
  };
}
