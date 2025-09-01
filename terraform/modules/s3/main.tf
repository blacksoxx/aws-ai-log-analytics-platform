resource "aws_s3_bucket" "raw_logs" {
  bucket        = "${var.prefix}-log-ingest"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "block_public_access" {
  bucket = aws_s3_bucket.raw_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "versioning" {
  bucket = aws_s3_bucket.raw_logs.id

  versioning_configuration {
    status = "Enabled"
  }
}
resource "aws_s3_bucket_policy" "lambda_access" {
  bucket = aws_s3_bucket.raw_logs.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Principal = { AWS = var.lambda_role_arn },
      Action    = [
        "s3:GetObject",
        "s3:ListBucket",
        "s3:PutObject"
      ],
      Resource = [
        aws_s3_bucket.raw_logs.arn,
        "${aws_s3_bucket.raw_logs.arn}/*"
      ]
    }]
  })
}
resource "aws_s3_bucket_notification" "lambda_trigger" {
  bucket = aws_s3_bucket.raw_logs.id

  lambda_function {
    lambda_function_arn = var.lambda_function_arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "logs/"
  }

  depends_on = [aws_s3_bucket_policy.lambda_access]
}