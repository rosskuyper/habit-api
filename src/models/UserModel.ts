import {attribute, hashKey, table} from '@aws/dynamodb-data-mapper-annotations'
import {DDB_HABITS_TABLE} from '../config'

@table(DDB_HABITS_TABLE)
class UserModel {
  @hashKey()
  userId!: string

  @attribute()
  completed?: boolean

  @attribute()
  first?: string

  @attribute()
  last?: string

  @attribute({defaultProvider: () => new Date()})
  createdAt!: Date

  @attribute({defaultProvider: () => new Date()})
  updatedAt!: Date
}

export default UserModel
