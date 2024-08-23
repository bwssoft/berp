import { EventsTopics } from "./topics.events.dto"

export interface BaseOmieEntity<T, E extends EventsTopics = EventsTopics> {
  messageId: string,
  topic: E,
  event: T
  appKey: string,
  appHash: string,
  origin: string
  author: AuthorOmieEntity
}

export interface AuthorOmieEntity {
  email: string,
  name: string,
  userId: number
}