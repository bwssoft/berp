import { singleton } from "@/app/lib/util/singleton";
import { IComponent, IComponentRepository } from "@/app/lib/@backend/domain";
import { componentRepository } from "@/app/lib/@backend/infra";

class CreateManyComponentUsecase {
  repository: IComponentRepository;

  constructor() {
    this.repository = componentRepository;
  }

  async execute(
    components: Omit<IComponent, "id" | "created_at" | "seq" | "sku">[]
  ) {
    // Agrupar components por categoria
    const componentsByCategory = components.reduce(
      (acc, component) => {
        if (!acc[component.category.id]) {
          acc[component.category.id] = [];
        }
        acc[component.category.id].push(component);
        return acc;
      },
      {} as Record<
        string,
        Omit<IComponent, "id" | "created_at" | "seq" | "sku">[]
      >
    );

    // Para cada categoria, encontrar o maior código e atribuir novos códigos sequenciais
    const _components: IComponent[] = [];

    for (const category in componentsByCategory) {
      // Encontre o último código da mesma categoria
      const aggregate = await this.repository.aggregate([
        { $match: { category: { id: category } } },
        { $sort: { seq: -1 } },
        { $limit: 1 },
      ]);

      const [last_component_with_same_category] =
        (await aggregate.toArray()) as IComponent[];
      let last_seq = last_component_with_same_category?.seq ?? 0;

      // Incrementar o código sequencialmente para cada component na categoria
      const categorizedComponents = componentsByCategory[category].map((i) => {
        last_seq += 1;
        return Object.assign(i, {
          created_at: new Date(),
          id: crypto.randomUUID(),
          seq: last_seq,
          sku: `${i.category.code}-${last_seq}`,
        });
      });

      // Adiciona os components processados à lista final
      _components.push(...categorizedComponents);
    }

    // Cria todos os components de uma vez
    return await this.repository.createMany(_components);
  }
}

export const createManyComponentUsecase = singleton(CreateManyComponentUsecase);
