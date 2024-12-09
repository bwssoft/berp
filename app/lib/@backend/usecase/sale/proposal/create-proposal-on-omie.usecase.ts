import { singleton } from "@/app/lib/util/singleton";
import { IClientRepository, IProductRepository, IProposalOmiegateway, IProposalRepository } from "../../../domain";
import { clientRepository, productRepository, proposalOmieGateway, proposalRepository, } from "@/app/lib/@backend/infra";
import { analyseProposalScenarioUsecase, IAnalyseProposalScenarioUsecase } from "./analyse-proposal-scenario.usecase";
import { nanoid } from "nanoid";
import { OmieEnterpriseEnum } from "../../../domain/@shared/gateway/omie.gateway.interface";
import { account, orderCategory } from "@/app/lib/constant/app-hashs";

class CreateProposalOnOmieUsecase {
  proposalRepository: IProposalRepository;
  clientRepository: IClientRepository;
  productRepository: IProductRepository;
  proposalGateway: IProposalOmiegateway;
  analyseProposalScenarioUsecase: IAnalyseProposalScenarioUsecase

  constructor() {
    this.proposalRepository = proposalRepository
    this.clientRepository = clientRepository
    this.productRepository = productRepository
    this.proposalGateway = proposalOmieGateway
    this.analyseProposalScenarioUsecase = analyseProposalScenarioUsecase
  }

  async execute(input: { proposal_id: string, scenario_id: string }) {
    const { proposal_id, scenario_id } = input
    try {
      const proposal = await this.proposalRepository.findOne({ id: proposal_id })
      if (!proposal) {
        throw new Error("No proposal found")
      }
      const client = await this.clientRepository.findOne({ id: proposal.client_id })
      if (!client) {
        throw new Error("No client found")
      }
      const scenario = proposal.scenarios.find(sce => sce.id === scenario_id)
      if (!scenario) {
        throw new Error("No scenario found")
      }
      const billing_process = proposal.billing_process?.[scenario_id]
      if (!billing_process) {
        throw new Error("No billing_process found")
      }
      const product_with_omie_enterprise = billing_process
        .map(bill => {
          const line_items = scenario.line_items.filter(li => bill.line_item_id.includes(li.id))
          return {
            omie_enterprise: bill.omie_enterprise,
            installment_quantity: bill.installment_quantity!,
            products_to_order: line_items.map(li => ({
              product_id: li.product_id,
              total_price: li.total_price,
              quantity: li.quantity,
            }))
          }
        })

      const products_id = product_with_omie_enterprise.map(({ products_to_order }) => products_to_order.map(p => p.product_id)).flat()

      const products = await productRepository.findAll({
        id: { $in: products_id }
      })

      await Promise.all(product_with_omie_enterprise.map(async (item) => {
        const { omie_enterprise, products_to_order, installment_quantity } = item
        const total_price_order = products_to_order.reduce((acc, cur) => acc + cur.total_price, 0)
        const installment_price = total_price_order / installment_quantity
        const codigo_cliente = client.omie_metadata!.codigo_cliente[omie_enterprise as OmieEnterpriseEnum]!
        const order = {
          cabecalho: {
            codigo_cliente,
            codigo_parcela: "000",
            codigo_pedido_integracao: nanoid(),
            data_previsao: new Date().toLocaleDateString(),
            etapa: "10"
          },
          det: products_to_order.map(({ product_id, quantity, total_price }) => {
            const product = products.find(p => p.id === product_id)
            const codigo_produto = product!.omie_metadata!.codigo_produto[omie_enterprise as OmieEnterpriseEnum]!
            const valor_unitario = (total_price / quantity).toFixed(2)
            return {
              ide: {
                codigo_item_integracao: nanoid(),
              },
              produto: {
                codigo_produto,
                quantidade: quantity,
                valor_unitario
              }
            }
          }),
          informacoes_adicionais: {
            codigo_categoria: orderCategory[omie_enterprise as OmieEnterpriseEnum],
            codigo_conta_corrente: account[omie_enterprise as OmieEnterpriseEnum],
            consumidor_final: "N",
            utilizar_emails: "dev.italo.souza@gmail.com",
          },
          lista_parcelas: {
            parcelas: Array.from({ length: installment_quantity }).map((_, index) => {
              const current_date = new Date(); // Pega a data atual
              current_date.setMonth(current_date.getMonth() + index + 1)
              return {
                numero_parcela: index + 1,
                valor: installment_price,
                data_vencimento: current_date.toLocaleDateString(),
                percentual: (100 / installment_quantity).toFixed(2)
              }
            })
          }
        }
        console.log(JSON.stringify(order, null, 2))
        // await this.proposalGateway.insertOne(order)
      }))
    } catch (err) {
      throw err;
    }
  }

}

export const createProposalOnOmieUsecase = singleton(
  CreateProposalOnOmieUsecase
);

