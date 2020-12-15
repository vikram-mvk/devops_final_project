provider "google" {
  project = "Enter_Your-Project-Id-@-here"
  region  = var.region_gcp
}

provider "aws" {
region = var.region_aws
}

module "module" {
  source ="./modules"
}