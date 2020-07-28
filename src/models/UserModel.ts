import {attribute, hashKey, table} from '@aws/dynamodb-data-mapper-annotations'
import {DDB_PRIMARY_TABLE} from '../config'

@table(DDB_PRIMARY_TABLE)
class UserModel {
  @hashKey()
  id!: string

  @attribute()
  completed?: boolean

  @attribute()
  email!: string

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
