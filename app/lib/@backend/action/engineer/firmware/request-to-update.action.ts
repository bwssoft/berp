"use server"

import { IDevice } from "@/backend/domain/engineer/entity/device.definition";
import { IFirmware } from "@/backend/domain/engineer/entity/firmware.definition";
import { IRequestToUpdate } from "@/backend/domain/engineer/entity/request-to-update-firmware.definition";
import { findOneRequestToUpdateUsecase } from "@/backend/usecase/engineer/firmware/request-to-update/find-one-request-to-update.usecase";
import { findAllRequestToUpdateUsecase } from "@/backend/usecase/engineer/firmware/request-to-update/find-all-request-to-update.usecase"

export async function findOneRequestToUpdate(requestToUpdate: Partial<IRequestToUpdate>) {
  return await findOneRequestToUpdateUsecase.execute(requestToUpdate)
}

export async function findAllRequestToUpdate(): Promise<(IRequestToUpdate & { device: IDevice, firmware: IFirmware })[]> {
  return await findAllRequestToUpdateUsecase.execute()
}



