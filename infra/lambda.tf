locals {
  lambda_function_name = "habit-graphql-main"
  lambda_function_zip  = "../build/lambda.zip"
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
      "dynamodb:*",
    ]

    resources = [
      aws_dynamodb_table.habit_primary.arn,
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

  statement {
    actions = [
      "kms:Encrypt",
      "kms:Decrypt",
      "kms:ReEncrypt*",
      "kms:GenerateDataKey*",
      "kms:CreateGrant",
      "kms:Describe*",
      "kms:Get*",
      "kms:List*",
    ]

    resources = [
      data.aws_kms_key.habit_ddb.arn
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

  kms_key_arn = data.aws_kms_key.ssm.arn

  environment {
    variables = {
      NODE_ENV                 = "production"
      OUTPUT_ERRORS_TO_CONSOLE = "true"
      PLAYGROUND_ENABLED       = "true"

      BUGSNAG_API_KEY = data.aws_kms_secrets.main.plaintext["bugsnag_api_key"]

      FIREBASE_PROJECT_ID   = "habit-tracker-282721"
      FIREBASE_PRIVATE_KEY  = data.aws_kms_secrets.main.plaintext["firebase_private_key"]
      FIREBASE_CLIENT_EMAIL = "firebase-adminsdk-pb28j@habit-tracker-282721.iam.gserviceaccount.com"

      DDB_PRIMARY_TABLE = aws_dynamodb_table.habit_primary.id

      CORS_ALLOWED_ORIGINS = "https://habitualizer.com, https://www.habitualizer.com, https://api.habitualizer.com"
    }
  }
}
