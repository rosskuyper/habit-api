resource "aws_dynamodb_table" "habits" {
  name         = "habit-api-habits"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"

  server_side_encryption {
    enabled     = true
    kms_key_arn = data.aws_kms_key.habit_ddb.arn
  }

  attribute {
    name = "userId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "habit_auth" {
  name         = "habit-api-auth"
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

  attribute {
    name = "expiresAt"
    type = "N"
  }

  ttl {
    enabled        = true
    attribute_name = "expiresAt"
  }
}
