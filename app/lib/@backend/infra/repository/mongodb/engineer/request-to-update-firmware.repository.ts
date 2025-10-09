import { singleton } from "@/app/lib/util/singleton";
import { IRequestToUpdate } from "@/backend/domain/engineer/entity/request-to-update-firmware.definition";
import { BaseRepository } from "../@base";

class RequestToUpdateRepository extends BaseRepository<IRequestToUpdate> {
  constructor() {
    super({
      collection: "firmware-request-to-update",
      db: "berp"
    });
  }
}

export const requestToUpdateRepository = singleton(RequestToUpdateRepository)

