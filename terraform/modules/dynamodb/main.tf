resource "aws_dynamodb_table" "log_summaries" {
  name         = "${var.prefix}-log-summaries"
  billing_mode = "PAY_PER_REQUEST" # Pay per read/write
  hash_key     = "log_id"          # Partition key
  range_key    = "timestamp"       # Sort key

  attribute {
    name = "log_id"
    type = "S" # String
  }

  attribute {
    name = "timestamp"
    type = "S" # ISO8601 string
  }

  ttl {
    attribute_name = "expiry_time" # Auto-expire logs after 30 days
    enabled        = true
  }

  tags = var.tags
}