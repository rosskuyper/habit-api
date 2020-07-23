locals {
  domain_name             = "habitualizer"
  client_id               = "1045305354627-8dff4jbap0sgmolhqq0derjcqjk06h0v.apps.googleusercontent.com"
  encrypted_client_secret = "AQICAHhOyM5btVbfvpZQ/4Z6nIPAoZ4eCTd0WLRyE39dZQLJxAEdvU6fPXHwEnCPS9qx2904AAAAdjB0BgkqhkiG9w0BBwagZzBlAgEAMGAGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMa7S92gc03Jajy6DkAgEQgDMMXd95ogFUZl+qNEfwLxuygVtb18Mv0FzwRBt2h6Ge9CSIB1mZIyQ+1yzODKLyDDntjaM="
  callback_urls = [
    "https://habitualizer.com/oauth/callback",
    "http://localhost:3000/oauth/callback",
  ]
}

data "aws_kms_secrets" "decrypted_idp_client_secret" {
  secret {
    name    = "value"
    payload = local.encrypted_client_secret

    context = {
      service = local.service_name
    }
  }
}

resource "aws_cognito_user_pool" "main" {
  name = "${local.service_name}-user-pool"

  username_attributes = ["email"]

  username_configuration {
    case_sensitive = false
  }

  mfa_configuration = "OPTIONAL"

  software_token_mfa_configuration {
    enabled = true
  }

  schema {
    name                     = "email"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = true
  }

  schema {
    name                     = "family_name"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = false
  }

  schema {
    name                     = "given_name"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = false
  }

  password_policy {
    minimum_length                   = 8
    require_lowercase                = false
    require_numbers                  = false
    require_symbols                  = false
    require_uppercase                = false
    temporary_password_validity_days = 7
  }

  admin_create_user_config {
    allow_admin_create_user_only = true
  }

  # lifecycle {
  #   ignore_changes = [schema]
  # }
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = local.domain_name
  user_pool_id = aws_cognito_user_pool.main.id
}

resource "aws_cognito_identity_provider" "main" {
  user_pool_id  = aws_cognito_user_pool.main.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    authorize_scopes = "profile email openid"
    client_id        = local.client_id
    client_secret    = data.aws_kms_secrets.decrypted_idp_client_secret.plaintext["value"]
  }

  attribute_mapping = {
    email    = "email"
    username = "sub"
  }
}

resource "aws_cognito_user_pool_client" "main" {
  name                          = local.service_name
  user_pool_id                  = aws_cognito_user_pool.main.id
  prevent_user_existence_errors = "ENABLED"
  generate_secret               = true

  callback_urls = local.callback_urls

  read_attributes = [
    "given_name",
    "family_name",
    "email"
  ]

  write_attributes = [
    "given_name",
    "family_name",
    "email"
  ]

  supported_identity_providers = [
    aws_cognito_identity_provider.main.provider_name
  ]

  allowed_oauth_flows_user_pool_client = true

  allowed_oauth_flows = [
    "code", "implicit"
  ]

  allowed_oauth_scopes = [
    "phone",
    "email",
    "openid",
    "profile"
  ]

  explicit_auth_flows = [
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]

  depends_on = [
    aws_cognito_user_pool.main,
    aws_cognito_identity_provider.main
  ]
}

resource "aws_ssm_parameter" "user_pool_client_id" {
  name      = "/${local.service_name}/client_id"
  type      = "String"
  value     = aws_cognito_user_pool_client.main.id
  overwrite = "true"
}

resource "aws_ssm_parameter" "user_pool_client_secret" {
  name      = "/${local.service_name}/client_secret"
  type      = "SecureString"
  value     = aws_cognito_user_pool_client.main.client_secret
  key_id    = data.aws_kms_key.ssm.id
  overwrite = "true"
}

resource "aws_ssm_parameter" "user_pool_domain" {
  name      = "/${local.service_name}/domain"
  type      = "String"
  value     = "${local.domain_name}.auth.${data.aws_region.current.name}.amazoncognito.com"
  overwrite = "true"
}

resource "aws_ssm_parameter" "user_pool_id" {
  name      = "/${local.service_name}/user_pool_id"
  type      = "String"
  value     = aws_cognito_user_pool.main.id
  overwrite = "true"
}

resource "aws_ssm_parameter" "user_pool_endpoint" {
  name      = "/${local.service_name}/user_pool_endpoint"
  type      = "String"
  value     = aws_cognito_user_pool.main.endpoint
  overwrite = "true"
}
