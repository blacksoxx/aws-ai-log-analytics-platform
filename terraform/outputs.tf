output "lambda_iam_role_arn" {
  value       = module.lambda_iam.role_arn
  description = "Role ARN of the Lambda execution role"
}

output "api_gateway_invoke_url" {
  description = "Invoke URL to trigger the logs API"
  value       = module.api_gateway.invoke_url
}
