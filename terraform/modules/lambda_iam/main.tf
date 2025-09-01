resource "aws_iam_role" "lambda_exec" {
  name               = "${var.prefix}-summarizer-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Modified policy attachment using the full ARN format
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  depends_on = [aws_iam_role.lambda_exec]  # Explicit dependency
}

resource "aws_iam_policy" "data_access" {
  name        = "${var.prefix}-lambda-data-access"
  description = "S3 and DynamoDB access for Lambda"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = ["s3:GetObject", "s3:ListBucket"],
        Resource = ["${var.s3_bucket_arn}", "${var.s3_bucket_arn}/*"]
      },
      {
        Effect   = "Allow",
        Action   = ["dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "dynamodb:Query"],
        Resource = [var.dynamodb_table_arn]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "data_access" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.data_access.arn
  depends_on = [aws_iam_role.lambda_exec]
}

resource "aws_iam_policy" "bedrock_access" {
  name        = "${var.prefix}-lambda-bedrock-access"
  description = "Allow Lambda to invoke AWS Bedrock models"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["bedrock:InvokeModel"]
        Resource = ["arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2"]

      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "bedrock_access" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.bedrock_access.arn
  depends_on = [aws_iam_role.lambda_exec]
}