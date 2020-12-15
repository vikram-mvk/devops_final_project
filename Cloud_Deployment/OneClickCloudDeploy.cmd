@echo "Ensuring pre-requisites"

@echo "Press enter if you have GCloud Cli installed and configured with your project id updated via cli"
timeout 360

start gcloud auth application-default login

@echo "Press enter after you have authenticated your application"
timeout 360

cd Terraform
terraform init
terraform apply -auto-approve

@echo "Updating your Kubectl config"

start gcloud container clusters get-credentials twitterclonecluster  --region us-east1-b
cd ..


@echo "waiting to 1 minute before deploying pods"

timeout 60


kubectl apply -f Deploy.yaml

@echo "Deployment complete.. Go to your Gcloud console and get the public URL of the React Service Loadbalancer to access the application"

PAUSE