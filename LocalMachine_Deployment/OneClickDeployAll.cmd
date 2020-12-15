echo "Deploying RedisJSON Queue"
docker run -d -t -p 1111:6379 --name redis_json_queue redislabs/rejson:latest

echo "Deploying RedisJSON Cache"
docker run -d -t -p 1112:6379 --name redis_json_cache redislabs/rejson:latest

echo "Deploying RedisJSON Q for MongoDB"
docker run -d -t -p 1113:6379 --name redis_json_mongoQ redislabs/rejson:latest

echo "Deploying MongoDB"
docker run -d -t -p 27017:27017 --name mongodb mongo:latest

echo "Deploying S3 Worker"
docker run -d -t -p 5001:50001 --name s3worker vikrammvk/s3uploader

echo "Container deployments done...."

echo "Deploying Backends.."

echo "Deploying API GATEWAY Backend"
cd Backends
pip install -r requirements.txt
start python api_gateway.py

echo "Deploying Queue Listener Backend"
start python queue_listener.py

echo "Deploying Mongo Worker Backend"
start python backend_worker.py

echo "backend deployments done.."

cd ..

cd Frontend

npm start

echo "Go to http://localhost:3000 to access the application"

PAUSE