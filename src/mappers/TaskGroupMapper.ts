import {
  TaskGroupModel,
  forgeTaskGroup,
  ForgeTaskGroupAttrs,
  ForgeTaskAttrs,
  forgeTask,
  TaskModel,
  findTask,
} from '../models/TaskGroupModel'
import {dynamoDbMapper} from '../services/dynamodb'

// The Task Group name is required on store or update
type StoreOrUpdateTaskGroupParams = ForgeTaskGroupAttrs & {
  name: string
}

/**
 * Create and store a new Task Group
 */
export const storeTaskGroup = async (params: StoreOrUpdateTaskGroupParams): Promise<TaskGroupModel> => {
  const taskGroup = forgeTaskGroup(params)

  return dynamoDbMapper.put(taskGroup)
}

/**
 * Update an existing Task Group
 */
export const updateTaskGroup = async (params: StoreOrUpdateTaskGroupParams): Promise<TaskGroupModel> => {
  const taskGroup = await dynamoDbMapper.get(forgeTaskGroup(params))

  taskGroup.name = params.name
  taskGroup.updatedAt = new Date()

  return await dynamoDbMapper.update(taskGroup)
}

/**
 * Create a new task within a task group
 */
export type StoreTaskParams = {
  taskGroup: ForgeTaskGroupAttrs
  task: ForgeTaskAttrs
}
export const storeTask = async (params: StoreTaskParams): Promise<TaskModel> => {
  // Get the parent task group
  const taskGroup = await dynamoDbMapper.get(forgeTaskGroup(params.taskGroup))

  // Forge the task, which will be embedded into the task group
  const task = forgeTask(params.task)

  // This logic can be contained here as versioning will prevent race conditions
  if (findTask(taskGroup, task)) {
    throw new Error('TaskID already exists')
  }

  // Add to the tasks
  taskGroup.tasks.push(task)

  // Save
  await dynamoDbMapper.update(taskGroup)

  // return the task
  return task
}
