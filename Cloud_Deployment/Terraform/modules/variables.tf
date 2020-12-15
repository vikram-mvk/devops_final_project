
variable "region_gcp" {
  description = "region for gcp"
  default= "us-east1-b"
}

variable "node_count" {
  description = "number of nodes for gcp cluster"
  default= "3"
}

variable "node_pool_machine_type" {
  description = "type of machine"
  default= "e2-medium"
}

variable "node_pool_count" {
  description = "number of node pools"
  default= "4"
}

variable "bucket_name" {
  description = "bucket to save twittter images"
  default= "vikram-twitter-clone"
}
