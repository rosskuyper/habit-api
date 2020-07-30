import {attribute, hashKey, table, rangeKey} from '@aws/dynamodb-data-mapper-annotations'
import {addDays} from 'date-fns'
import {DDB_PRIMARY_TABLE} from '../config/env'

@table(DDB_PRIMARY_TABLE)
class TokenModel {
  // User SubId
  @hashKey()
  id!: string

  // Access Key
  @rangeKey()
  sortKey!: string

  @attribute()
  refreshToken!: string

  @attribute()
  consumedAt?: Date

  @attribute({defaultProvider: () => new Date()})
  createdAt!: Date

  @attribute({defaultProvider: () => addDays(new Date(), 60)})
  ttl!: Date
}

export type ForgeTokenAttrs = {
  subId: string
  accessToken: string
  refreshToken: string
}

export const forgeToken = (attrs: ForgeTokenAttrs): TokenModel => {
  return Object.assign(new TokenModel(), {
    id: attrs.subId,
    sortKey: attrs.accessToken,
    refreshToken: attrs.refreshToken,
  })
}

export default TokenModel
