import { IRule } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base";
import { singleton } from "@/app/lib/util/singleton";

class RuleRepository extends BaseRepository<IRule> {
  constructor() {
    super({
      collection: "commercial-rule",
      db: "berp"
    });
  }

}

export const ruleRepository = singleton(RuleRepository)
