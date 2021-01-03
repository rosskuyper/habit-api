import {TaskGroupModel, forgeTaskGroup, ForgeTaskGroupAttrs} from '../models/TaskGroupModel'
import {dynamoDbMapper} from '../services/dynamodb'

export type StoreTaskGroupParams = ForgeTaskGroupAttrs

export const storeTaskGroup = async (params: StoreTaskGroupParams): Promise<TaskGroupModel> => {
  const taskGroup = forgeTaskGroup(params)

  return dynamoDbMapper.put(taskGroup)
}

export type UpdateTaskGroupParams = ForgeTaskGroupAttrs

export const updateTaskGroup = async (params: UpdateTaskGroupParams): Promise<TaskGroupModel> => {
  const taskGroup = await dynamoDbMapper.get(forgeTaskGroup(params))

  taskGroup.name = params.name
  taskGroup.updatedAt = new Date()

  return await dynamoDbMapper.update(taskGroup)
}
