resource "aws_api_gateway_rest_api" "logs_api" {
  name        = "${var.prefix}-logs-api"
  description = "API Gateway for retrieving processed log summaries"
}

# ───────────────────────────
# /logs
resource "aws_api_gateway_resource" "logs_resource" {
  rest_api_id = aws_api_gateway_rest_api.logs_api.id
  parent_id   = aws_api_gateway_rest_api.logs_api.root_resource_id
  path_part   = "logs"
}

resource "aws_api_gateway_method" "get_logs" {
  rest_api_id   = aws_api_gateway_rest_api.logs_api.id
  resource_id   = aws_api_gateway_resource.logs_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_logs_integration" {
  rest_api_id             = aws_api_gateway_rest_api.logs_api.id
  resource_id             = aws_api_gateway_resource.logs_resource.id
  http_method             = aws_api_gateway_method.get_logs.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${var.lambda_invoke_arn}/invocations"
}

# ───────────────────────────
# /logs/search
resource "aws_api_gateway_resource" "search_resource" {
  rest_api_id = aws_api_gateway_rest_api.logs_api.id
  parent_id   = aws_api_gateway_resource.logs_resource.id
  path_part   = "search"
}

resource "aws_api_gateway_method" "search_logs" {
  rest_api_id   = aws_api_gateway_rest_api.logs_api.id
  resource_id   = aws_api_gateway_resource.search_resource.id
  http_method   = "GET"
  authorization = "NONE"
  request_parameters = {
    "method.request.querystring.q" = false
  }
}

resource "aws_api_gateway_integration" "search_logs_integration" {
  rest_api_id             = aws_api_gateway_rest_api.logs_api.id
  resource_id             = aws_api_gateway_resource.search_resource.id
  http_method             = aws_api_gateway_method.search_logs.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${var.lambda_invoke_arn}/invocations"
}

# ───────────────────────────
# /logs/{id}
resource "aws_api_gateway_resource" "log_by_id_resource" {
  rest_api_id = aws_api_gateway_rest_api.logs_api.id
  parent_id   = aws_api_gateway_resource.logs_resource.id
  path_part   = "{id}"
}

resource "aws_api_gateway_method" "log_by_id" {
  rest_api_id   = aws_api_gateway_rest_api.logs_api.id
  resource_id   = aws_api_gateway_resource.log_by_id_resource.id
  http_method   = "GET"
  authorization = "NONE"
  request_parameters = {
    "method.request.path.id" = true
  }
}

resource "aws_api_gateway_integration" "log_by_id_integration" {
  rest_api_id             = aws_api_gateway_rest_api.logs_api.id
  resource_id             = aws_api_gateway_resource.log_by_id_resource.id
  http_method             = aws_api_gateway_method.log_by_id.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${var.lambda_invoke_arn}/invocations"
}

# ───────────────────────────
# Deployment + Stage
resource "aws_api_gateway_deployment" "logs_deployment" {
  depends_on = [
    aws_api_gateway_integration.get_logs_integration,
    aws_api_gateway_integration.search_logs_integration,
    aws_api_gateway_integration.log_by_id_integration
  ]

  rest_api_id = aws_api_gateway_rest_api.logs_api.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_integration.get_logs_integration.id,
      aws_api_gateway_integration.search_logs_integration.id,
      aws_api_gateway_integration.log_by_id_integration.id
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_api_gateway_stage" "logs_stage" {
  stage_name    = "prod"
  rest_api_id   = aws_api_gateway_rest_api.logs_api.id
  deployment_id = aws_api_gateway_deployment.logs_deployment.id
}
