terraform {
  backend "s3" {
    encrypt        = true
    bucket         = "tf-remote-state-eu-central-1-habit"
    dynamodb_table = "tf-state-lock-table"
    region         = "eu-central-1"
    key            = "habit-api/terraform.tfstate"
  }
}
