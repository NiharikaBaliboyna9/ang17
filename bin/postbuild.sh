#!/bin/bash
echo "pwd"
pwd
echo "ls"
ls
echo "ls dist"
ls ./dist
cd ./dist
echo "cd then ls -a"
ls -a
echo "ls angular-new"
cd angular-new
ls -a
echo "ls dist/angular-new"
ls ./dist/angular-new

rm -rf ./.amplify-hosting

mkdir -p ./.amplify-hosting/compute

cp -r ./dist/angular-new/server ./.amplify-hosting/compute/default

cp -r ./dist/angular-new/browser ./.amplify-hosting/static

cp deploy-manifest.json ./.amplify-hosting/deploy-manifest.json