import {
  TaskGroupModel,
  forgeTaskGroup,
  ForgeTaskGroupAttrs,
  ForgeTaskAttrs,
  forgeTask,
  TaskModel,
  findTask,
  findTaskIndex,
} from '../models/TaskGroupModel'
import {dynamoDbMapper} from '../services/dynamodb'

// The Task Group name is required on store or update
type StoreOrUpdateTaskGroupParams = ForgeTaskGroupAttrs & {
  name: string
}

/**
 * Base Utils
 */
export const getTaskGroup = (taskGroup: ForgeTaskGroupAttrs): Promise<TaskGroupModel> => {
  return dynamoDbMapper.get(forgeTaskGroup(taskGroup))
}

export type TaskGroupTaskTuple = {
  taskGroup: TaskGroupModel
  task: TaskModel
  taskIndex: number
}
export const getTaskGroupAndTask = async (
  taskGroupAttrs: ForgeTaskGroupAttrs,
  taskAttrs: ForgeTaskAttrs,
): Promise<TaskGroupTaskTuple> => {
  const taskGroup = await getTaskGroup(taskGroupAttrs)

  // Get a reference to the task we need to update
  const taskIndex = findTaskIndex(taskGroup, {id: taskAttrs.taskId})

  if (taskIndex === -1) {
    throw new Error('Task not found in Task Group')
  }

  return {
    taskGroup,
    taskIndex,
    task: taskGroup.tasks[taskIndex],
  }
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
  const taskGroup = await getTaskGroup(params)

  taskGroup.name = params.name
  taskGroup.updatedAt = new Date()

  return await dynamoDbMapper.update(taskGroup)
}

/**
 * Create a new task within a task group
 */
export type StoreTaskParams = {
  taskGroup: ForgeTaskGroupAttrs
  task: ForgeTaskAttrs & {
    text: string
  }
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

export type DeleteTaskParams = {
  taskGroup: ForgeTaskGroupAttrs
  task: ForgeTaskAttrs
}
export const deleteTask = async (params: DeleteTaskParams): Promise<TaskGroupModel> => {
  const {taskGroup, taskIndex} = await getTaskGroupAndTask(params.taskGroup, params.task)

  taskGroup.tasks.splice(taskIndex, 1)

  await dynamoDbMapper.update(taskGroup)

  return taskGroup
}

/**
 * Mark a task as completed or not completed
 */
export type SetTaskCompletedParams = {
  taskGroup: ForgeTaskGroupAttrs
  task: ForgeTaskAttrs & {
    completedAt?: Date
  }
}
export const setTaskCompleted = async (params: SetTaskCompletedParams): Promise<TaskModel> => {
  const {taskGroup, taskIndex} = await getTaskGroupAndTask(params.taskGroup, params.task)

  // Set or unset the completedAt field
  taskGroup.tasks[taskIndex].completedAt = params.task.completedAt

  // Save
  await dynamoDbMapper.update(taskGroup)

  return taskGroup.tasks[taskIndex]
}
