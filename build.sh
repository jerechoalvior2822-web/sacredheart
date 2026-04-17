#!/bin/bash
set -e
echo "Installing dependencies..."
yarn install
echo "Building application..."
yarn build
echo "Build complete!"
