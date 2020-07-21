import {attribute, hashKey, table} from '@aws/dynamodb-data-mapper-annotations'
import {v4 as uuidv4} from 'uuid'

@table('habit-api-habits')
class UserModel {
  @hashKey({defaultProvider: () => uuidv4()})
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
