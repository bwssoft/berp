"use server"

import { IDevice, IFirmware, IRequestToUpdate } from "../../domain"
import {
  findOneRequestToUpdateUsecase,
  findAllRequestToUpdateUsecase
} from "../../usecase"

export async function findOneRequestToUpdate(requestToUpdate: Partial<IRequestToUpdate>) {
  return await findOneRequestToUpdateUsecase.execute(requestToUpdate)
}

export async function findAllRequestToUpdate(): Promise<(IRequestToUpdate & { device: IDevice, firmware: IFirmware })[]> {
  return await findAllRequestToUpdateUsecase.execute()
}


