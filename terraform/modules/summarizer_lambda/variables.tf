variable "prefix" {
  description = "Resource naming prefix"
  type        = string
}

variable "lambda_role_arn" {
  description = "ARN of the Lambda execution role"
  type        = string
}

variable "lambda_zip_path" {
  description = "Path to the Lambda deployment ZIP"
  type        = string
}

variable "dynamodb_table_name" {
  description = "Name of the DynamoDB table"
  type        = string
}

variable "s3_bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}

variable "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  type        = string
}
variable "lambda_zip_hash" {
  description = "Hash of the Lambda ZIP file to force redeployment on content change"
  type        = string
} 