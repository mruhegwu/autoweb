variable "aws_region" {
  description = "AWS region to deploy resources into."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Short name used to prefix all resource names (e.g. 'autoweb')."
  type        = string
  default     = "autoweb"
}

variable "environment" {
  description = "Deployment environment (e.g. 'production', 'staging')."
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "Custom domain name for the website (e.g. 'example.com'). Leave empty to use the CloudFront domain."
  type        = string
  default     = ""
}

variable "index_document" {
  description = "Default root object served by CloudFront."
  type        = string
  default     = "index.html"
}

variable "error_document" {
  description = "Object returned on 4xx errors (useful for single-page apps)."
  type        = string
  default     = "index.html"
}

variable "price_class" {
  description = "CloudFront price class. PriceClass_100 covers NA/EU only and is cheapest."
  type        = string
  default     = "PriceClass_100"

  validation {
    condition     = contains(["PriceClass_All", "PriceClass_200", "PriceClass_100"], var.price_class)
    error_message = "price_class must be one of: PriceClass_All, PriceClass_200, PriceClass_100."
  }
}

variable "tags" {
  description = "Additional tags to apply to all resources."
  type        = map(string)
  default     = {}
}
