# 🌐 Cloud-Native AI-powered Log Analytics Platform

This project is a **cloud-native log analytics solution** that ingests logs in real-time, stores them reliably, applies **AI anomaly detection**, and exposes them via an API and a **React + TypeScript dashboard**.

---

## 🚀 Features
- **Real-time log ingestion** with **Kinesis Firehose**
- **Scalable storage** in **S3** (raw logs) and **DynamoDB** (metadata & indexing)
- **Amazon Bedrock Summarization** to resume complex logs into simple text
- **API Gateway** with **Lambda** backend to expose logs and analytics
- **React + Vite + Tailwind dashboard** to visualize logs and anomalies

---

## 🏗️ Architecture Overview
![System Architecture](/Architecture.png)

**Data Flow:**
1. Applications / services generate logs.
2. Logs are ingested via **Kinesis Firehose**.
3. Firehose delivers logs to:
   - **Amazon S3** (long-term raw storage)
   - **DynamoDB** (metadata for APIs)
4. **Amazon Bedrock** detects anomalies and stores results in DynamoDB.
5. **API Gateway + Lambda** expose endpoints to query logs.
6. **React Dashboard** fetches logs from APIs for visualization.

---

## 📦 Project Structure

```
.
├── terraform/                     # Infrastructure code
├── lambda_functions/              # API layer (Lambda functions)                 
└── cloud-log-viz/                 # Dashboard
```

---

## ⚙️ Setup & Configuration

### 1️⃣ Infrastructure Setup
1. Install [Terraform](https://developer.hashicorp.com/terraform/downloads).
2. Configure AWS credentials:
   ```bash
   aws configure
   ```
3. Deploy infrastructure:
   ```bash
   cd terraform
   terraform init
   terraform plan
   terraform apply
   ```

This provisions:
- Kinesis Firehose
- S3 Bucket
- DynamoDB Table
- 2 Lambda functions
- API Gateway endpoints

---

### 2️⃣ Dashboard Setup
1. Go to dashboard:
   ```bash
   cd cloud-log-viz
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173).

---

### 3️⃣ Environment Variables

Set in `.env` (for backend & dashboard):
```env
AWS_API_GATEWAY_URL=https://<your-api-gateway-url>/prod
```

---

## 📊 Example API Usage

- List all logs:
  ```bash
  curl https://<api>/prod/logs
  ```
- Get a specific log:
  ```bash
  curl https://<api>/prod/logs/{log_id}
  ```

