import {DataMapper} from '@aws/dynamodb-data-mapper'
import DynamoDB = require('aws-sdk/clients/dynamodb')

export const dynamoDbMapper = new DataMapper({
  client: new DynamoDB(),
})
