import {TaskGroupModel, forgeTaskGroup, ForgeTaskGroupAttrs} from '../models/TaskGroupModel'
import {dynamoDbMapper} from '../services/dynamodb'

export type StoreTokenSetParams = ForgeTaskGroupAttrs

export const storeTaskGroup = async (params: StoreTokenSetParams): Promise<TaskGroupModel> => {
  const taskGroup = forgeTaskGroup(params)

  return dynamoDbMapper.put(taskGroup)
}
