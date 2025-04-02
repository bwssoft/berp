import { singleton } from "@/app/lib/util"
import { IProfileRepository } from "../../../domain"
import { profileRepository } from "../../../infra"

namespace Dto {
    export type Input = {
      id: string
      active: boolean
    }
    export type Output = { success: boolean, error?: string }
  }

class ActiveProfileUsecase {
    repository: IProfileRepository
    constructor() {
        this.repository = profileRepository
    }

    async execute(input: Dto.Input): Promise<Dto.Output> {
        const { id, active } = input

        try {
            const profile = await this.repository.updateOne({ id }, { $set: { active} } );
            if(!profile) {
                return { success: false, error: "Perfil nao encontrado ou não atualizado." }
            }

            return { success: true }
        } catch (err) {
            return { success: false, error: err instanceof Error ? err.message : JSON.stringify(err) }
        }
    }
}

export const activeProfileUsecase = singleton(ActiveProfileUsecase);