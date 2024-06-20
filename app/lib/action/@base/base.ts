import { BaseRepository } from "../../repository/mongodb/@base/base";

interface IEntity extends Object { }

interface Constructor<Entity extends IEntity> {
  repository: BaseRepository<Entity>
}

export class BaseAction<Entity extends IEntity> {
  protected repository: BaseRepository<Entity>

  constructor(props: Constructor<Entity>) {
    this.repository = props.repository
  }

  async createOne(input: Entity) {
    await this.repository.create(input)
    return input
  }

  async findOne(input: Entity) {
    return await this.repository.findOne(input)
  }
} 