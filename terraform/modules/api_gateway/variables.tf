variable "prefix" {
  description = "Prefix for resource naming"
  type        = string
}

variable "lambda_invoke_arn" {
  description = "The Lambda function's invoke ARN"
  type        = string
}

variable "aws_region" {
  default = "us-east-1"
}