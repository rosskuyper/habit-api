import {attribute, hashKey, table} from '@aws/dynamodb-data-mapper-annotations'
import {addDays} from 'date-fns'
import {DDB_AUTH_TABLE} from '../config'

@table(DDB_AUTH_TABLE)
class AuthModel {
  @hashKey()
  accessToken!: string

  @attribute()
  idToken!: string

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

export default AuthModel
