resource "aws_lambda_function" "logs_api" {
  function_name = "${var.prefix}-logs-api"
  handler       = "lambda_logs_api.lambda_handler"
  runtime       = "python3.12"
  filename      = var.lambda_zip_path
  source_code_hash = var.lambda_zip_hash
  role          = var.lambda_role_arn
  timeout       = 15

  environment {
    variables = {
      DYNAMODB_TABLE = var.dynamodb_table_name
    }
  }
}

resource "aws_lambda_permission" "allow_apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.logs_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_gateway_execution_arn}/*"
}

output "lambda_function_name" {
  value = aws_lambda_function.logs_api.function_name
}

output "lambda_arn" {
  value = aws_lambda_function.logs_api.arn
}
