resource "aws_lambda_function" "summarizer" {
  function_name = "${var.prefix}-log-summarizer"
  handler       = "main.lambda_handler"
  runtime       = "python3.12"
  role          = var.lambda_role_arn  
  filename      = var.lambda_zip_path  
  timeout       = 30                   # Seconds
  memory_size   = 256                  # MB        
  source_code_hash = var.lambda_zip_hash

  environment {
    variables = {
      DYNAMODB_TABLE = var.dynamodb_table_name
    }
  }
}

# S3 Trigger Permission
resource "aws_lambda_permission" "s3_trigger" {
  statement_id  = "AllowS3Invoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.summarizer.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = var.s3_bucket_arn
}

# S3 Notification
resource "aws_s3_bucket_notification" "log_notification" {
  bucket = var.s3_bucket_name
  lambda_function {
    lambda_function_arn = aws_lambda_function.summarizer.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "logs/"
  }
  depends_on = [aws_lambda_permission.s3_trigger]
}