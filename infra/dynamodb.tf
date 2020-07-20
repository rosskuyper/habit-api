resource "aws_dynamodb_table" "habits" {
  name         = "habit-api-habits"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "UserId"

  server_side_encryption {
    enabled     = true
    kms_key_arn = data.aws_kms_key.habit_ddb.arn
  }

  attribute {
    name = "UserId"
    type = "S"
  }
}
