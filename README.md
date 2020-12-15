# CSYE-7220 Project - Twitter Clone
​
## Steps to run the project locally on your machine:
    Pre-requisites: Python, pip, nodejs, npm and docker (for docker toolbox, modify the localhost url in the backend and frontend applications with docker-machine-ip, if necessary) 
* Dowload/Clone this repository
* Go inside LocalMachine_Deployment folder and click the OneClickDeployAll.cmd file to have the entire application running in a single click ! 
    * (If you face any issues, please refer to the type commands manually.txt file to manually enter the commands)
* Wait for the react development server to start (1 min) and go to localhost:3000 to access your application

## Steps to run the project on Google Cloud:
    Pre-requisites: (if not done already)
    1. Create a Google cloud account (if not done already), install Google Cloud CLI, run gcloud init to configure (create new project) 
    
    2. Copy the project id and paste inside /Terraform/providers.tf.

    3. Run the command gcloud config set project <project-id> to let the cli know that you're currently working on this project. Get your project ID from Gcloud console
    
    4. Go to your gcloud console and search Kubernetes clusters, then click enable kubernetes services (requires billing), if not done already

    5. Run the command "gcloud auth application-default login" in a terminal to authorize. 

* Dowload/Clone this repository
* Go inside Cloud_Deployment folder and click the OneClickDeployAll.cmd file to have the entire application running in a single click ! 
  * (If you face any issues, please refer to the type commands manually.txt file to manually enter the commands)
* Go to your gcloud console, search kubernetes engine -> go to services and ingress -> get the public IP of the React frontend service and use it to access the application. (Note: It takes 10 to 15 minutes for the loadbalancer to work after succesfull deployment)
* Go into Terraform folder, open a cmd and type terraform destroy to destroy these resources.


## About the Application
<img src="https://github.com/vikramzone/devops_final_project/blob/main/Images/mongo.png" height="60" />&nbsp;&nbsp;&nbsp;
<img src="https://github.com/vikramzone/devops_final_project/blob/main/Images/javascript.png" height="45" />&nbsp;&nbsp;&nbsp;
<img src="https://github.com/vikramzone/devops_final_project/blob/main/Images/python.png" height="45" />&nbsp;&nbsp;&nbsp;
<img src="https://github.com/vikramzone/devops_final_project/blob/main/Images/prom.png" height="45" />&nbsp;&nbsp;
<img src="https://github.com/vikramzone/devops_final_project/blob/main/Images/grafana.png" height="45" />&nbsp;&nbsp;&nbsp;
<img src="https://github.com/vikramzone/devops_final_project/blob/main/Images/kubernetes.png" height="45" />&nbsp;&nbsp;&nbsp;
<img src="https://github.com/vikramzone/devops_final_project/blob/main/Images/gcp.jpg" height="45" />&nbsp;&nbsp;&nbsp;
<img src="https://github.com/vikramzone/devops_final_project/blob/main/Images/docker.png" height="45" />&nbsp;&nbsp;&nbsp;
<img src="https://github.com/vikramzone/devops_final_project/blob/main/Images/terraform.png" height="45" />&nbsp;&nbsp;&nbsp;
<img src="https://github.com/vikramzone/devops_final_project/blob/main/Images/react.png" height="45" />&nbsp;&nbsp;&nbsp;
<img src="https://github.com/vikramzone/devops_final_project/blob/main/Images/redux.png" height="45" />&nbsp;&nbsp;&nbsp;
<img src="https://github.com/vikramzone/devops_final_project/blob/main/Images/redis.png" height="45" />&nbsp;&nbsp;&nbsp;
​

## Technology Stack used:
| Microservice | Language | Function | Port     | UseCase       |
|-------|:-----------|:----------------------------- |:------------| :-----------|
| Frontend | React | Users see this beautiful frontend | 80(nginx) | Responsive screen supports mobile and Desktop users both alike |
| Backend | Python | Atomic addition to database | 5000 | reduces the write requests on database |
| API Gateway | Flask | Used as a gateway from frontend, has all API's | 5000 | Exposes various enpoints and implements JWT authorization |
| Business | Python | Censors obscene tweets | 5000 | Business use case: to censor all offensive tweets |


## Architecture Design
![](https://github.com/vikramzone/devops_final_project/blob/main/Images/Architecture.png)

​
## Infrastructure as Code - Terraform
* Created Kubernetes cluster on Google Cloud Platform
* Created Node pools in the Kubernetes cluster for running various implementations of k8s
* Created S3 buckets in Amazon Web Services Cloud
* Attached required policies to S3 bucket to list, get and put objects uploaded by user
[Terraform Repository](https://github.com/vikramzone/devops_final_project/tree/main/Cloud_Deployment/Terraform)
​
## Logging & Metrics: Prometheus and Grafana
* Used Prometheus and Grafana for monitoring of metrics and logs 
* logged the metrics using prometheus and further used grafana as a dashboard for 
* Able to monitor all traffic from pods, nodes and cluster
* To be able to get logs to Gafana we need to add Prometheus as a datasource in grafana

![](https://github.com/vikramzone/devops_final_project/blob/main/Images/monitoring.png)
​
## Cloud Services: AWS,GCP Hybrid cloud services 
* Used GCP to run kubernetes cluster to provision all microservices
* Used AWS to create buckets to store images
​

# Twitter Microservice:
API Impementation with `Flask` and Programming language : `python` for the backend microservices
UI Impementation with `React` and Programming language : `javascript` for the frontend microservice
​
Application functionalities used:
1. JWT - for authenticating users
2. like/comment - for liking and commenting on others tweets
3. Responsiveness - Mobile and Web browser compatible
4. Censor offensive tweets - used Python library for censoring offensive tweets
5. redis cache - reduces reads/writes on database
6. mongodb - for saving user data
7. docker - to containerize microservices
8. JMeter - for load testing
9. putObject/getObject policies to S3worker microservice - for file upload/delete purpose to S3
