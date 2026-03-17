# Terraform – autoweb static website infrastructure

This directory contains Terraform configuration that provisions AWS infrastructure
for hosting the **autoweb** static website.

## Architecture

```
Browser → CloudFront (HTTPS) → S3 bucket (private)
```

| Resource | Purpose |
|---|---|
| `aws_s3_bucket` | Stores compiled website files |
| `aws_cloudfront_distribution` | Global CDN with HTTPS termination |
| `aws_cloudfront_origin_access_control` | Allows CloudFront to read from the private S3 bucket |
| `aws_acm_certificate` *(optional)* | TLS certificate for a custom domain |
| `aws_route53_record` *(optional)* | DNS records for a custom domain |

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/downloads) ≥ 1.5
- AWS credentials configured (environment variables, `~/.aws/credentials`, or an IAM role)
- An AWS account with permissions to manage S3, CloudFront, ACM, and Route 53

## Usage

### 1. Initialise the working directory

```bash
cd terraform
terraform init
```

### 2. Review the plan

```bash
terraform plan
```

### 3. Apply

```bash
terraform apply
```

Terraform will output the CloudFront URL once the apply completes.

## Variables

| Name | Default | Description |
|---|---|---|
| `aws_region` | `us-east-1` | AWS region for S3 and supporting resources |
| `project_name` | `autoweb` | Prefix for all resource names |
| `environment` | `production` | Deployment environment |
| `domain_name` | `""` | Custom domain (leave empty to use the CloudFront domain) |
| `index_document` | `index.html` | Default root object |
| `error_document` | `index.html` | Error page (also used for SPA client-side routing) |
| `price_class` | `PriceClass_100` | CloudFront price class |
| `tags` | `{}` | Extra tags merged onto all resources |

## Custom domain (optional)

Set `domain_name` to your domain name and make sure the Route 53 hosted zone
already exists in the same AWS account. Terraform will:

1. Request an ACM certificate in `us-east-1` (required by CloudFront).
2. Create DNS validation records in Route 53.
3. Wait for the certificate to be validated.
4. Associate the certificate with the CloudFront distribution.
5. Add an A-alias record pointing the domain at CloudFront.

```bash
terraform apply -var="domain_name=example.com"
```

## Deploying website files

After `terraform apply`, upload your built site to the S3 bucket:

```bash
aws s3 sync ./dist/ s3://$(terraform output -raw s3_bucket_name)/ --delete
```

Then invalidate the CloudFront cache to serve the new content immediately:

```bash
aws cloudfront create-invalidation \
  --distribution-id $(terraform output -raw cloudfront_distribution_id) \
  --paths "/*"
```

## Outputs

| Name | Description |
|---|---|
| `s3_bucket_name` | Name of the S3 bucket |
| `s3_bucket_arn` | ARN of the S3 bucket |
| `cloudfront_distribution_id` | CloudFront distribution ID |
| `cloudfront_domain_name` | CloudFront domain name |
| `website_url` | Primary website URL |
