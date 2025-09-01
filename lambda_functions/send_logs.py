# Make sure to have the necessary permissions to access Firehose.   
# Script to test Kineis -> S3 connectivity by sending logs to Firehose
import boto3
import json
import uuid
import time

firehose = boto3.client('firehose', region_name='us-east-1')  # Change region if needed
STREAM_NAME = 'youssef-log-stream'  # Your Firehose stream name

for i in range(10):
    log = {
        "id": str(uuid.uuid4()),
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "level": "INFO",
        "message": f"Test log {i} - Successful deployment!"
    }
    
    firehose.put_record(
        DeliveryStreamName=STREAM_NAME,
        Record={'Data': json.dumps(log) + '\n'}
    )
    print(f"Sent log: {log}")
    time.sleep(1)