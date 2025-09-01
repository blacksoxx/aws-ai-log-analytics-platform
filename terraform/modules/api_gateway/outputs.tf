output "invoke_url" {
  description = "Public invoke URL"
  value       = "https://${aws_api_gateway_rest_api.logs_api.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_stage.logs_stage.stage_name}"
}

output "execution_arn" {
  value = aws_api_gateway_rest_api.logs_api.execution_arn
}
