import { EventsTopics } from "../../../controller/client/topics.events.dto"
import { IClientFacade } from "../facade"

export type ITopicEventsUseCaseConstants = {
  [key in EventsTopics]: keyof Omit<IClientFacade, 'converterObjectUseCase'>
}
export const TopicEventsUseCaseConstants: ITopicEventsUseCaseConstants = {
  [EventsTopics.Include]: 'upsertClientFromWebhookUsecase',
  [EventsTopics.Update]: 'upsertClientFromWebhookUsecase'
}