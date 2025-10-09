import { singleton } from "@/app/lib/util/singleton";
import IItem from "@/backend/domain/logistic/entity/item.entity"; // Assumindo que IItemRepository existe em domain
import { itemRepository } from "@/backend/infra"; // Assumindo que itemRepository existe em infra

class UpdateOneItemUsecase {
  repository: IItemRepository;

  constructor() {
    // Injeta a dependência do repositório
    this.repository = itemRepository;
  }

  // O método execute recebe um query para identificar o documento e o valor a ser atualizado.
  // O valor omite 'id' e 'created_at' pois estes geralmente não são atualizáveis diretamente.
  async execute(
    query: { id: string },
    value: Omit<IItem, "id" | "created_at">
  ) {
    // Chama o método updateOne do repositório, utilizando $set para aplicar as atualizações.
    return await this.repository.updateOne(query, { $set: value });
  }
}

// Exporta a instância singleton do caso de uso
export const updateOneItemUsecase = singleton(UpdateOneItemUsecase);

