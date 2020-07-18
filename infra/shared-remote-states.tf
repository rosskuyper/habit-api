data "terraform_remote_state" "environment" {
  backend   = "s3"
  workspace = terraform.workspace

  config = {
    bucket = "tf-remote-state-eu-central-1-habit"
    key    = "rk-tf-environment/terraform.tfstate"
    region = "eu-central-1"
  }
}
