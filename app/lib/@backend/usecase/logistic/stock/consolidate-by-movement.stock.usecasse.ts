import { singleton } from "@/app/lib/util";
import { IMovement, Movement } from "@/backend/domain/logistic/entity/movement.entity";
import { IStockRepository } from "@/backend/domain/logistic/repository/stock.repository";
import { stockRepository } from "@/backend/infra";

class ConsolidateStockByMovementUseCase {
  private stockRepository: IStockRepository;

  constructor() {
    this.stockRepository = stockRepository;
  }

  async execute(movements: IMovement[]): Promise<void> {
    const consolidatedMap = new Map<
      string,
      { itemId: string; baseId: string; quantity: number }
    >();

    for (const movement of movements) {
      if (movement.status !== Movement.Status.CONFIRM) continue;

      const itemId = movement.item.id;
      const baseId = movement.base.id;
      const key = `${itemId}:${baseId}`;

      const prev = consolidatedMap.get(key);

      const quantityChange =
        movement.type === "ENTER" ? movement.quantity : -movement.quantity;

      if (prev) {
        prev.quantity += quantityChange;
      } else {
        consolidatedMap.set(key, { itemId, baseId, quantity: quantityChange });
      }
    }

    if (consolidatedMap.size === 0) {
      return; // Nada a atualizar
    }

    // 2. Preparar atualizações em massa
    const bulkOps = Array.from(consolidatedMap.values()).map(
      ({ itemId, baseId, quantity }) => ({
        filter: {
          "item.id": itemId,
          "base.id": baseId,
        },
        update: {
          $inc: { quantity },
          $set: { updated_at: new Date() },
        },
        upsert: true, // Cria se não existir
      })
    );

    // 3. Executar atualização em massa via IStockRepository
    await this.stockRepository.updateBulk(bulkOps);
  }
}

export const consolidateStockByMovementUseCase = singleton(
  ConsolidateStockByMovementUseCase
);
