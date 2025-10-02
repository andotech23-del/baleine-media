terraform {
  required_version = ">= 1.6.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 5.0.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

locals {
  services = {
    backend = {
      name        = "cordia-backend"
      image       = var.backend_image
      env         = var.common_env
      concurrency = 80
    }
    scribe = {
      name  = "cordia-scribe-bot"
      image = var.scribe_image
      env   = var.common_env
    }
    billing = {
      name  = "cordia-billing-bot"
      image = var.billing_image
      env   = var.common_env
    }
    vision = {
      name  = "cordia-vision-bot"
      image = var.vision_image
      env   = var.common_env
    }
    care = {
      name  = "cordia-care-bot"
      image = var.care_image
      env   = var.common_env
    }
  }
}

resource "google_project_service" "enabled" {
  for_each = toset([
    "run.googleapis.com",
    "firestore.googleapis.com",
    "iam.googleapis.com",
    "cloudbuild.googleapis.com"
  ])

  project = var.project_id
  service = each.key
}

resource "google_firestore_database" "default" {
  name   = "(default)"
  project = var.project_id
  location_id = var.region
  type = "FIRESTORE_NATIVE"
}

resource "google_cloud_run_v2_service" "services" {
  for_each = local.services

  name     = each.value.name
  location = var.region

  template {
    containers {
      image = each.value.image
      env = [for k, v in each.value.env : {
        name  = k
        value = v
      }]
    }
  }

  lifecycle {
    ignore_changes = [template[0].containers[0].image]
  }
}

resource "google_cloud_run_v2_service_iam_member" "invoker" {
  for_each = local.services

  name   = google_cloud_run_v2_service.services[each.key].name
  project = var.project_id
  location = var.region
  role   = "roles/run.invoker"
  member = "allUsers"
}
