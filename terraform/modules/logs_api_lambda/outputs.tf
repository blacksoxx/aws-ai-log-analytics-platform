output "logs_api_lambda_arn" {
  value = aws_lambda_function.logs_api.arn
}

output "logs_api_lambda_name" {
  value = aws_lambda_function.logs_api.function_name
}

output "lambda_invoke_arn" {
  value = aws_lambda_function.logs_api.invoke_arn
}
