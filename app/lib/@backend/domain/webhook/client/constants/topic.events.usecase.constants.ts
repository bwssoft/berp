import { EventsTopics } from "../events/topics.events"
import { IClientFacade } from "../facade"

export type ITopicEventsUseCaseConstants = {
  [key in EventsTopics]: keyof Omit<IClientFacade, 'converterObjectUseCase'>
}
export const TopicEventsUseCaseConstants: ITopicEventsUseCaseConstants = {
  [EventsTopics.Include]: 'createClientUseCase',
  [EventsTopics.Update]: 'updateClientUseCase'
}