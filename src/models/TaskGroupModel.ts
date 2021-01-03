import {embed} from '@aws/dynamodb-data-mapper'
import {attribute, hashKey, rangeKey, table, versionAttribute} from '@aws/dynamodb-data-mapper-annotations'
import {DDB_PRIMARY_TABLE} from '../config/env'

export class Task {
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

  @attribute({memberType: embed(Task)})
  tasks!: Array<Task>

  @versionAttribute()
  version!: number

  @attribute({defaultProvider: () => new Date()})
  createdAt!: Date

  @attribute({defaultProvider: () => new Date()})
  updatedAt!: Date
}

export type ForgeTaskGroupAttrs = {
  userId: string
  taskGroupId: string
  name: string
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
