import { singleton } from "@/app/lib/util/singleton";
import { IInput, IInputRepository } from "@/app/lib/@backend/domain";
import { inputRepository } from "@/app/lib/@backend/repository/mongodb";

class CreateManyInputUsecase {
  repository: IInputRepository;

  constructor() {
    this.repository = inputRepository;
  }

  async execute(inputs: Omit<IInput, "id" | "created_at" | "code">[]) {
    // Agrupar inputs por categoria
    const inputsByCategory = inputs.reduce((acc, input) => {
      if (!acc[input.category]) {
        acc[input.category] = [];
      }
      acc[input.category].push(input);
      return acc;
    }, {} as Record<string, Omit<IInput, "id" | "created_at" | "code">[]>);

    // Para cada categoria, encontrar o maior código e atribuir novos códigos sequenciais
    const _inputs: IInput[] = [];

    for (const category in inputsByCategory) {
      // Encontre o último código da mesma categoria
      const aggregate = await this.repository.aggregate([
        { $match: { category } },
        { $sort: { code: -1 } },
        { $limit: 1 }
      ]);

      const [last_input_with_same_category] = await aggregate.toArray() as IInput[];
      let lastCode = last_input_with_same_category?.code ?? 0;

      // Incrementar o código sequencialmente para cada input na categoria
      const categorizedInputs = inputsByCategory[category].map(i => {
        lastCode += 1;
        return Object.assign(i, {
          created_at: new Date(),
          id: crypto.randomUUID(),
          code: lastCode
        });
      });

      // Adiciona os inputs processados à lista final
      _inputs.push(...categorizedInputs);
    }

    // Cria todos os inputs de uma vez
    return await this.repository.createMany(_inputs);
  }
}

export const createManyInputUsecase = singleton(CreateManyInputUsecase);
