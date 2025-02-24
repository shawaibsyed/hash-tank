#!/bin/sh

# Build the Docker image
docker build -t hash-tank-backend .

# Run the Docker container in the background with the specified environment file and port mapping, and redirect the output to a file
docker run --name hash-tank-backend --env-file=.env.prod -p 8080:8080 hash-tank-backend > output.log 2>&1 &
