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
}

export type ForgeUserForStoreAttrs = ForgeUserAttrs & {
  email: string
  first: string
  last: string
}

const forgeUserPrimaryKey = (attrs: ForgeUserAttrs): {id: string; sortKey: string} => {
  return {
    id: attrs.subId,
    sortKey: `#PROFILE#${attrs.subId}`,
  }
}

export const forgeUserForStore = (attrs: ForgeUserForStoreAttrs): UserModel => {
  return Object.assign(new UserModel(), {
    ...forgeUserPrimaryKey(attrs),
    email: attrs.email,
    first: attrs.first,
    last: attrs.last,
  })
}

export const forgeUser = (attrs: ForgeUserAttrs): UserModel => {
  return Object.assign(new UserModel(), forgeUserPrimaryKey(attrs))
}

export default UserModel
