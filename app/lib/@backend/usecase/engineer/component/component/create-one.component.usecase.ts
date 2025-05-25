import { singleton } from "@/app/lib/util/singleton";
import { IComponent, IComponentRepository } from "@/app/lib/@backend/domain";
import { componentRepository } from "@/app/lib/@backend/infra";

class CreateOneComponentUsecase {
  repository: IComponentRepository;

  constructor() {
    this.repository = componentRepository;
  }

  async execute(
    component: Omit<IComponent, "id" | "created_at" | "seq" | "sku">
  ) {
    try {
      const last_component_with_same_category = await this.repository.findOne(
        { "category.id": component.category.id },
        { sort: { seq: -1 }, limit: 1 }
      );

      const seq = (last_component_with_same_category?.seq ?? 0) + 1;

      const _component = Object.assign(component, {
        created_at: new Date(),
        id: crypto.randomUUID(),
        seq,
        sku: `${component.category.code}-${seq}`,
      });

      await this.repository.create(_component);
      return {
        sucess: true,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          usecase: err instanceof Error ? err.message : JSON.stringify(err),
        },
      };
    }
  }
}

export const createOneComponentUsecase = singleton(CreateOneComponentUsecase);
