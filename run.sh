npm install

docker build --tag repo:1.0 .
docker run --publish 5000:3000 --detach --name repo repo:1.0