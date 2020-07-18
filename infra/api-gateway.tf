module "graphql_http_api" {
  source = "rosskuyper/apigw-lambda-proxy/aws"

  name          = "habit-graphql-http-api"
  protocol_type = "HTTP"
  lambda_arn    = aws_lambda_function.habit_graphql_main.arn

  domain_name     = "api.habitualizer.com"
  certificate_arn = data.terraform_remote_state.environment.outputs.habitualizer_com_eu_central_1_acm_arn
  security_policy = "TLS_1_2"

  zone_id = data.aws_route53_zone.habitualizer_com.zone_id
}
