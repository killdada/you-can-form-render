#! /bin/sh
git pull

cd ./client
yarn build

docker-compose build
docker-compose up -d
