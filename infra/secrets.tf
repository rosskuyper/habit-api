data "aws_kms_secrets" "main" {
  secret {
    name    = "bugsnag_api_key"
    payload = "AQICAHhOyM5btVbfvpZQ/4Z6nIPAoZ4eCTd0WLRyE39dZQLJxAE1MkkhMZs3mVzZglCsiRwqAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM5EqBu7DxJ5/IO/cIAgEQgDs3rqvPc+hnnE+G61TjEfnsDNfA9IcLVVNl93lWn7FAdp/jWwFnyDoBQvSIekjF5VIvIEdMuQ3fNvySAg=="

    context = {
      service = local.service_name
    }
  }
}
