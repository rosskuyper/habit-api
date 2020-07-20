locals {
  lambda_function_name = "habit-graphql-main"
  lambda_function_zip  = "../build/lambda.zip"
  service_name         = "habit-api"
}

data "aws_iam_policy_document" "habit_graphql_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"

      identifiers = [
        "lambda.amazonaws.com",
      ]
    }
  }
}

data "aws_iam_policy_document" "habit_graphql_main" {
  statement {
    actions = [
      "lambda:InvokeFunction",
      "xray:PutTraceSegments",
      "xray:PutTelemetryRecords",
      "xray:GetSamplingRules",
      "xray:GetSamplingTargets",
      "xray:GetSamplingStatisticSummaries",
    ]

    resources = ["*"]
  }

  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:CreateLogGroup",
      "logs:PutLogEvents",
    ]

    resources = [
      "*"
    ]
  }

  statement {
    actions = [
      "ssm:GetParameter",
      "ssm:GetParameters",
    ]

    resources = [
      "arn:aws:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter/${local.service_name}/*",
    ]
  }

  statement {
    actions = ["kms:Decrypt"]

    resources = [
      data.aws_kms_key.ssm.arn
    ]
  }
}

resource "aws_iam_role" "habit_graphql_main" {
  name = "${local.service_name}-lambda-service-role"

  assume_role_policy = data.aws_iam_policy_document.habit_graphql_assume_role.json
}

resource "aws_iam_role_policy" "habit_graphql_main" {
  name = "${local.service_name}-lambda-service-policy"

  role   = aws_iam_role.habit_graphql_main.id
  policy = data.aws_iam_policy_document.habit_graphql_main.json
}

resource "aws_lambda_function" "habit_graphql_main" {
  filename      = local.lambda_function_zip
  function_name = local.lambda_function_name
  role          = aws_iam_role.habit_graphql_main.arn

  source_code_hash = filebase64sha256(local.lambda_function_zip)

  handler = "index.handler"
  runtime = "nodejs12.x"

  memory_size = 384
  timeout     = 15

  environment {
    variables = {
      NODE_ENV         = "production",
      BUGSNAG_API_KEY  = "06e5d5340f1c75993d1c33e3c311ffc5",
      DDB_HABITS_TABLE = aws_dynamodb_table.habits.id,
    }
  }
}
