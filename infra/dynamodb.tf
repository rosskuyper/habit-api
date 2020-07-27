resource "aws_dynamodb_table" "habit_users" {
  name         = "habit-api-users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "sub"

  server_side_encryption {
    enabled     = true
    kms_key_arn = data.aws_kms_key.habit_ddb.arn
  }

  attribute {
    name = "sub"
    type = "S"
  }
}

resource "aws_dynamodb_table" "habit_tokens" {
  name         = "habit-api-tokens"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "accessToken"

  server_side_encryption {
    enabled     = true
    kms_key_arn = data.aws_kms_key.habit_ddb.arn
  }

  attribute {
    name = "accessToken"
    type = "S"
  }

  ttl {
    enabled        = true
    attribute_name = "expiresAt"
  }
}
