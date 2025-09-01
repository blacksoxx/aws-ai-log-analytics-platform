variable "prefix" {
  type        = string
  description = "Prefix for naming"
}

variable "lambda_zip_path" {
  type        = string
  description = "Path to the ZIP file"
}

variable "lambda_role_arn" {
  type        = string
  description = "IAM Role ARN for Lambda execution"
}

variable "dynamodb_table_name" {
  type        = string
  description = "Name of the DynamoDB table"
}

variable "api_gateway_execution_arn" {
  type        = string
  description = "API Gateway execution ARN"
}

variable "lambda_zip_hash" {
  type        = string
  description = "SHA256 hash of the Lambda ZIP file"
}