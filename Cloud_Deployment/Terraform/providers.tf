provider "google" {
  project = "capable-country-298617"
  region  = var.region_gcp
}

provider "aws" {
region = var.region_aws
}

module "module" {
  source ="./modules"
}