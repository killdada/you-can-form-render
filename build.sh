#! /bin/sh
cd ./client
yarn build:github

cd ../
docker-compose build
docker-compose up -d
