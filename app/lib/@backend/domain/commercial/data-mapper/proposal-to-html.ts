import { singleton } from "../../../../util";
import { IProposal } from "../..";


export interface IProposalToHtmlDataMapper {
  format(input: IProposal): string
}

class ProposalToHtmlDataMapper {
  format(input: IProposal): string {
    return `
    <html>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          @page {
            size: A4;
            margin: 1in;
          }
        </style>
      </head>
      <body class="bg-gray-100 text-gray-800 font-sans">
        <div class="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg">
          <h1 class="text-3xl font-bold text-blue-600 mb-4">Proposta Comercial</h1>
          <hr class="my-4">
          <h2 class="text-xl font-semibold text-gray-800 mb-2">Descrição</h2>
          <p class="text-gray-600 mb-4">${input.description}</p>
          <h2 class="text-xl font-semibold text-gray-800 mb-2">Endereço de Cobrança</h2>
          <hr class="my-4">
          <h2 class="text-2xl font-semibold text-blue-600 mb-4">Cenários</h2>
          ${input.scenarios.map((scenario: any) => `
            <div class="mb-8">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">${scenario.name}</h3>
              <p class="text-gray-600"><strong>Descrição:</strong> ${scenario.description}</p>
              <p class="text-gray-600"><strong>Moeda:</strong> ${scenario.currency}</p>
              <p class="text-gray-600"><strong>Total de Produtos:</strong> R$ ${scenario.product_total.toFixed(2)}</p>
              <p class="text-gray-600"><strong>Subtotal com Desconto:</strong> R$ ${scenario.subtotal_with_discount.toFixed(2)}</p>
              <p class="text-gray-600"><strong>Valor do Frete:</strong> R$ ${scenario.freight.value.toFixed(2)} (${scenario.freight.type})</p>
              <p class="text-gray-600"><strong>Total Geral:</strong> R$ ${scenario.grand_total.toFixed(2)}</p>
              <h4 class="text-lg font-semibold text-gray-800 mt-4 mb-2">Itens</h4>
              ${scenario.line_items.map((item: any) => `
                <div class="bg-gray-50 p-4 rounded mb-2">
                  <p class="text-gray-600"><strong>Produto ID:</strong> ${item.product_id}</p>
                  <p class="text-gray-600"><strong>Quantidade:</strong> ${item.quantity}</p>
                  <p class="text-gray-600"><strong>Preço Unitário:</strong> R$ ${item.unit_price.toFixed(2)}</p>
                  <p class="text-gray-600"><strong>Desconto:</strong> R$ ${item.discount.toFixed(2)}</p>
                  <p class="text-gray-600"><strong>Preço Total:</strong> R$ ${item.total_price.toFixed(2)}</p>
                </div>
              `).join('')}
            </div>
          `).join('')}
          <hr class="my-4">
          <p class="text-gray-600"><strong>ID do Cliente:</strong> ${input.client_id}</p>
          <p class="text-gray-600"><strong>Data de Criação:</strong> ${new Date(input.created_at).toLocaleDateString()}</p>
          <p class="text-gray-600"><strong>ID do Usuário:</strong> ${input.user_id}</p>
        </div>
      </body>
    </html>
  `
  }
}

export const proposalToHtmlDataMapper = singleton(ProposalToHtmlDataMapper)