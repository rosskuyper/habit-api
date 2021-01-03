import {embed} from '@aws/dynamodb-data-mapper'
import {attribute, hashKey, rangeKey, table, versionAttribute} from '@aws/dynamodb-data-mapper-annotations'
import {DDB_PRIMARY_TABLE} from '../config/env'

export class TaskModel {
  @attribute()
  id!: string

  @attribute()
  text!: string

  @attribute()
  checkedAt?: Date

  @attribute({defaultProvider: () => new Date()})
  createdAt!: Date
}

@table(DDB_PRIMARY_TABLE)
export class TaskGroupModel {
  // User SubId
  @hashKey()
  hashKey!: string

  // `#TASKGROUP#${taskGroupUUID}`
  @rangeKey()
  rangeKey!: string

  @attribute()
  id!: string

  @attribute()
  name!: string

  @attribute({memberType: embed(TaskModel)})
  tasks!: Array<TaskModel>

  @versionAttribute()
  version!: number

  @attribute({defaultProvider: () => new Date()})
  createdAt!: Date

  @attribute({defaultProvider: () => new Date()})
  updatedAt!: Date
}

export type ForgeTaskAttrs = {
  taskId: string
  text?: string
}

export const forgeTask = (attrs: ForgeTaskAttrs): TaskModel => {
  return Object.assign(new TaskModel(), {
    id: attrs.taskId,
    text: attrs.text,
  })
}

export type ForgeTaskGroupAttrs = {
  userId: string
  taskGroupId: string
  name?: string
}

export const forgeTaskGroup = (attrs: ForgeTaskGroupAttrs): TaskGroupModel => {
  return Object.assign(new TaskGroupModel(), {
    hashKey: attrs.userId,
    rangeKey: `#TASKGROUP#${attrs.taskGroupId}`,
    id: attrs.taskGroupId,
    name: attrs.name,
    tasks: [],
  })
}

/**
 * Utils
 */
export const findTask = (taskGroup: TaskGroupModel, task: TaskModel): TaskModel | undefined => {
  return taskGroup.tasks.find((innerTask) => {
    return innerTask.id === task.id
  })
}
