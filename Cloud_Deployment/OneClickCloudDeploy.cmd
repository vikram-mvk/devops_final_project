cd Terraform
terraform init
terraform apply -auto-approve

start gcloud container clusters get-credentials twitterclonecluster  --region us-east1-b
cd ..

kubectl apply -f Deploy.yaml

@echo "Deployment complete.. Go to your Gcloud console and get the public URL of the React Service Loadbalancer to access the application"

PAUSE