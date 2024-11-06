import { findAllProductionOrderWithProduct } from "@/app/lib/@backend/action";
import { IProductionOrder } from "@/app/lib/@backend/domain";
import { productionOrderConstants } from "@/app/lib/constant";

export default async function Page() {
  const productionOrders = await findAllProductionOrderWithProduct();

  const productionOrdersByStage = productionOrders.reduce((acc, current) => {
    acc[productionOrderConstants.stage[current.stage]] = (acc[productionOrderConstants.stage[current.stage]] ?? 0) + 1

    return acc
  }, {} as Record<string, number>)

  const productsQuantity = productionOrders.reduce((acc, current) => {
    const productsWithQuantities = current.sale_order.products
    const currentItemProductsMetadata = current.products_in_sale_order

    productsWithQuantities.forEach((product) => {
      const productMetadata = currentItemProductsMetadata.find((productMetadata) => productMetadata.id === product.product_id)!

      acc[productMetadata.name] = (acc[productMetadata.name] ?? 0) + product.quantity
    })

    return acc
  }, {} as Record<string, number>)

  // spreads since sort mutates the array in memory reference
  const productionOrdersWithMostProductsQuantity = [...productionOrders].sort((po1, po2) => {
    const productionOrder1ProductsQuantity = po1.sale_order.products.reduce((acc, curr) => acc + curr.quantity, 0)
    const productionOrder2ProductsQuantity = po2.sale_order.products.reduce((acc, curr) => acc + curr.quantity, 0)

    return productionOrder2ProductsQuantity - productionOrder1ProductsQuantity
  }).slice(0, 5)
  
  const finishedProductionOrdersProductsQuantity = productionOrders
    .filter((productionOrder) => productionOrder.stage === 'completed')
    .reduce((acc, current) => {
      const productsWithQuantities = current.sale_order.products
      const currentItemProductsMetadata = current.products_in_sale_order

      productsWithQuantities.forEach((product) => {
        const productMetadata = currentItemProductsMetadata.find((productMetadata) => productMetadata.id === product.product_id)!

        acc[productMetadata.name] = (acc[productMetadata.name] ?? 0) + product.quantity
      })

      return acc
    }, {} as Record<string, number>)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Dashboard para insights sobre as ordens de produção 
          </p>
        </div> 
      </div>
    </div>
  )
}