resource "aws_dynamodb_table" "habit_primary" {
  name           = "habit-api-primary"
  billing_mode   = "PROVISIONED"
  read_capacity  = 10
  write_capacity = 10

  hash_key  = "hashKey"
  range_key = "rangeKey"

  server_side_encryption {
    enabled     = true
    kms_key_arn = data.aws_kms_key.habit_ddb.arn
  }

  attribute {
    name = "hashKey"
    type = "S"
  }

  attribute {
    name = "rangeKey"
    type = "S"
  }
}
