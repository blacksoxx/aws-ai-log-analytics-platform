import boto3
import os
import json
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])

def lambda_handler(event, context):
    method = event.get("httpMethod")
    path = event.get("path", "")
    params = event.get("queryStringParameters") or {}
    path_params = event.get("pathParameters") or {}

    # GET /logs
    if method == "GET" and path.endswith("/logs") and not path_params:
        return list_logs()

    # GET /logs/{id}?timestamp=...
    if method == "GET" and "id" in path_params:
        log_id = path_params["id"]
        timestamp = params.get("timestamp")
        if not timestamp:
            return {"statusCode": 400, "body": json.dumps({"error": "Missing timestamp"})}
        return get_log_by_id(log_id, timestamp)

    # GET /logs/search?q=...
    if method == "GET" and path.endswith("/logs/search"):
        query = params.get("q", "")
        return search_logs(query)

    return {"statusCode": 404, "body": json.dumps({"error": "Not Found"})}

    

def get_log_by_id(log_id, timestamp):
    try:
        response = table.query(
            KeyConditionExpression=Key("log_id").eq(str(log_id)) & Key("timestamp").eq(timestamp),
            Limit=1
        )
        items = response.get("Items", [])
        if items:
            return {"statusCode": 200, "body": json.dumps(items[0])}
        else:
            return {"statusCode": 404, "body": json.dumps({"error": "Log not found"})}
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}

def list_logs():
    try:
        response = table.scan(Limit=100)
        return {"statusCode": 200, "body": json.dumps(response.get("Items", []))}
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}


def search_logs(query):
    try:
        query_lower = query.lower()
        response = table.scan(
            FilterExpression=Attr("raw_message").contains(query_lower) | 
                           Attr("summary").contains(query_lower) |
                           Attr("log_level").contains(query_lower) |
                           Attr("ai_summary").contains(query_lower)
        )
        return {"statusCode": 200, "body": json.dumps(response.get("Items", []))}
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}