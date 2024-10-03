#!/bin/bash
pwd

ls

ls ./dist

ls ./dist/angular-new

rm -rf ./.amplify-hosting

mkdir -p ./.amplify-hosting/compute

cp -r ./dist/angular-new/server ./.amplify-hosting/compute/default

cp -r ./dist/angular-new/browser ./.amplify-hosting/static

cp deploy-manifest.json ./.amplify-hosting/deploy-manifest.json