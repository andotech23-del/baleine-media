variable "project_id" {
  description = "GCP project id"
  type        = string
}

variable "region" {
  description = "Primary deployment region"
  type        = string
  default     = "us-central1"
}

variable "backend_image" {
  description = "OCI image for the backend service"
  type        = string
}

variable "scribe_image" {
  description = "OCI image for the scribe agent"
  type        = string
}

variable "billing_image" {
  description = "OCI image for the billing agent"
  type        = string
}

variable "vision_image" {
  description = "OCI image for the vision agent"
  type        = string
}

variable "care_image" {
  description = "OCI image for the care agent"
  type        = string
}

variable "common_env" {
  description = "Environment variables shared across services"
  type        = map(string)
  default     = {}
}
