"use server"

import { IDevice, IFirmware, IRequestToUpdate } from "@/app/lib/@backend/domain"
import {
  findOneRequestToUpdateUsecase,
  findAllRequestToUpdateUsecase
} from "@/app/lib/@backend/usecase"

export async function findOneRequestToUpdate(requestToUpdate: Partial<IRequestToUpdate>) {
  return await findOneRequestToUpdateUsecase.execute(requestToUpdate)
}

export async function findAllRequestToUpdate(): Promise<(IRequestToUpdate & { device: IDevice, firmware: IFirmware })[]> {
  return await findAllRequestToUpdateUsecase.execute()
}


