module "lambda_iam" {
  source            = "./modules/lambda_iam"
  prefix            = var.prefix
  s3_bucket_arn     = module.s3.bucket_arn
  dynamodb_table_arn = module.dynamodb.table_arn
}

module "s3" {
  source              = "./modules/s3"
  prefix              = var.prefix
  aws_region          = var.aws_region
  lambda_role_arn     = module.lambda_iam.role_arn
  lambda_function_arn = module.summarizer_lambda.lambda_arn
}

module "summarizer_lambda" {
  source              = "./modules/summarizer_lambda"
  prefix              = var.prefix
  lambda_role_arn     = module.lambda_iam.role_arn
  lambda_zip_path     = "../lambda_functions/summarizer/summarizer.zip"
  lambda_zip_hash     = filesha256("../lambda_functions/summarizer/summarizer.zip")
  dynamodb_table_name = module.dynamodb.table_name
  s3_bucket_name      = module.s3.bucket_name
  s3_bucket_arn       = module.s3.bucket_arn
}

module "dynamodb" {
  source = "./modules/dynamodb"
  prefix = var.prefix
  tags   = {
    Environment = "dev"
    Project     = "log-analytics"
  }
}

module "kinesis_firehose" {
  source = "./modules/kinesis_firehose"
  prefix = var.prefix
  s3_arn = module.s3.bucket_arn
}

module "logs_api_lambda" {
  source                  = "./modules/logs_api_lambda"
  prefix                  = var.prefix
  lambda_zip_path         = "../lambda_functions/logs_api/lambda_logs_api.zip"
  lambda_zip_hash         = filesha256("../lambda_functions/logs_api/lambda_logs_api.zip")
  lambda_role_arn         = module.lambda_iam.role_arn
  dynamodb_table_name     = module.dynamodb.table_name
  api_gateway_execution_arn = module.api_gateway.execution_arn 
}

module "api_gateway" {
  source             = "./modules/api_gateway"
  prefix             = var.prefix
  aws_region         = var.aws_region
  lambda_invoke_arn  = module.logs_api_lambda.lambda_arn
}
