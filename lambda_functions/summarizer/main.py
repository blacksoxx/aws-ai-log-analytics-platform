import boto3
import json
import os
import uuid
from datetime import datetime

# Clients
s3 = boto3.client('s3')
bedrock = boto3.client('bedrock-runtime')
dynamodb = boto3.resource('dynamodb')

# Environment variables
TABLE_NAME = os.environ['DYNAMODB_TABLE']
table = dynamodb.Table(TABLE_NAME)

MODEL_ID = "anthropic.claude-v2"

def lambda_handler(event, context):
    try:
        # Extract S3 event info
        record = event['Records'][0]
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']

        print(f"Processing file from S3: s3://{bucket}/{key}")

        # Fetch and decode file
        response = s3.get_object(Bucket=bucket, Key=key)
        body = response['Body'].read().decode('utf-8')
        logs = body.strip().splitlines()

        for line in logs:
            try:
                log_entry = json.loads(line)

                log_message = log_entry.get("message", "")
                log_level = log_entry.get("level", "INFO")
                timestamp = log_entry.get("timestamp", datetime.utcnow().isoformat())

                # Build Claude prompt
                prompt = f"\n\nHuman: Summarize this log entry:\n{log_message}\n\nAssistant:"

                # Bedrock call
                response = bedrock.invoke_model(
                    modelId=MODEL_ID,
                    contentType="application/json",
                    accept="application/json",
                    body=json.dumps({
                        "prompt": prompt,
                        "max_tokens_to_sample": 100,
                        "temperature": 0.5,
                        "top_p": 0.9,
                        "stop_sequences": ["\n\nHuman:"]
                    })
                )

                summary_payload = json.loads(response['body'].read())
                summary = summary_payload.get("completion", "").strip()
                log_id = str(uuid.uuid4())

                # Write to DynamoDB
                table.put_item(
                    Item={
                        "log_id": log_id,
                        "timestamp": timestamp,
                        "log_level": log_level,
                        "raw_message": log_message,
                        "summary": summary,
                        "source_file": key,
                        "processed": True
                    }
                )
                dynamodb.update_item(
                    TableName=TABLE_NAME,
                    Key={
                        'log_id': {'S': log_id},
                        'timestamp': {'S': timestamp}
                    },
                    UpdateExpression="SET processed = :val",
                    ExpressionAttributeValues={
                        ':val': {'BOOL': True}
                    }
                )

                
                print(f"Processed log: {log_message[:40]}... → {summary[:40]}...")

            except Exception as line_err:
                print(f"Failed to process log line: {line_err}")

        return {
            'statusCode': 200,
            'body': f"Processed {len(logs)} logs from {key}"
        }

    except Exception as err:
        print(f"Error processing log entry: {err}")
        return {
            'statusCode': 500,
            'body': f"Failed to process file: {err}"
        }
