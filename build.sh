#! /bin/sh
cd ./client
yarn build

cd ../
docker-compose build
docker-compose up -d
