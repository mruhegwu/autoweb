output "s3_bucket_name" {
  description = "Name of the S3 bucket that holds the website files."
  value       = aws_s3_bucket.website.id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket."
  value       = aws_s3_bucket.website.arn
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution."
  value       = aws_cloudfront_distribution.website.id
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution (always available, even without a custom domain)."
  value       = aws_cloudfront_distribution.website.domain_name
}

output "website_url" {
  description = "Primary URL of the website."
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.website.domain_name}"
}
