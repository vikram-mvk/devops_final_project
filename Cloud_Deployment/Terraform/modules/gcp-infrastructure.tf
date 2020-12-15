# GKE cluster
resource "google_container_cluster" "primary" {
  name     = "twitterclonecluster"
  location = var.region_gcp

  remove_default_node_pool = true
  initial_node_count       = var.node_count

  master_auth {
    username = ""
    password = ""

    client_certificate_config {
      issue_client_certificate = false
    }
  }
}

# GKE node pools
resource "google_container_node_pool" "primary_preemptible_nodes" {
  name       = "my-node-pool"
  location   = var.region_gcp
  cluster    = google_container_cluster.primary.name
  node_count = var.node_pool_count

  node_config {
    preemptible  = true
    machine_type = var.node_pool_machine_type

    metadata = {
      disable-legacy-endpoints = "true"
    }

    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }
}

output "kubernetes_cluster_name" {
  value       = google_container_cluster.primary.name
  description = "GKE Cluster Name"
}