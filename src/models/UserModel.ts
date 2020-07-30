import {attribute, hashKey, table, rangeKey} from '@aws/dynamodb-data-mapper-annotations'
import {DDB_PRIMARY_TABLE} from '../config/env'

@table(DDB_PRIMARY_TABLE)
class UserModel {
  // User SubId
  @hashKey()
  id!: string

  // `#PROFILE#${subId}`
  @rangeKey()
  sortKey!: string

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

export type ForgeUserAttrs = {
  subId: string
  email: string
  first: string
  last: string
}

export const forgeUser = (attrs: ForgeUserAttrs): UserModel => {
  return Object.assign(new UserModel(), {
    id: attrs.subId,
    sortKey: `#PROFILE#${attrs.subId}`,
    email: attrs.email,
    first: attrs.first,
    last: attrs.last,
  })
}

export default UserModel
