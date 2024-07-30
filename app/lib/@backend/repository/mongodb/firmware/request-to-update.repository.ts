import { singleton } from "@/app/lib/util/singleton";
import { IRequestToUpdate } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base/base";

class RequestToUpdateRepository extends BaseRepository<IRequestToUpdate> {
  constructor() {
    super({
      collection: "firmware-request-to-update",
      db: "berp"
    });
  }
}

export const requestToUpdateRepository = singleton(RequestToUpdateRepository)
