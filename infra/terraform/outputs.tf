output "cloud_run_urls" {
  value = { for k, svc in google_cloud_run_v2_service.services : k => svc.uri }
}
