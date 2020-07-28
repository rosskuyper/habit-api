import {attribute, hashKey, table} from '@aws/dynamodb-data-mapper-annotations'
import {addDays} from 'date-fns'
import {DDB_PRIMARY_TABLE} from '../config'

@table(DDB_PRIMARY_TABLE)
class TokenSet {
  @hashKey()
  id!: string

  @attribute()
  idToken!: string

  @attribute()
  accessToken!: string

  @attribute()
  refreshToken!: string

  @attribute({defaultProvider: () => false})
  consumed!: boolean

  @attribute({defaultProvider: () => new Date()})
  createdAt!: Date

  @attribute({defaultProvider: () => new Date()})
  updatedAt!: Date

  @attribute({defaultProvider: () => addDays(new Date(), 60)})
  expiresAt!: Date
}

export default TokenSet
