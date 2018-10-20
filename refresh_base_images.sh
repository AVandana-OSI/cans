#!/bin/bash

#Change the tag
TAG=2
docker build -f docker/base_images/Dockerfile.cans -t cwds/cans_base_image:$TAG -t cwds/cans_base_image:latest .
docker build -f docker/base_images/Dockerfile.cans_testing -t cwds/cans_testing_base_image:$TAG -t cwds/cans_testing_base_image:latest .
docker login
docker push cwds/cans_base_image
docker push cwds/cans_testing_base_image
