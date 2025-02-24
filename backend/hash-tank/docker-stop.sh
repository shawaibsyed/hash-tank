#!/bin/sh

# docker ps -qf "ancestor=hash-tank-backend-trial" --filter "status=running" | xargs docker stop
docker stop hash-tank-backend
docker rm hash-tank-backend
docker rmi hash-tank-backend