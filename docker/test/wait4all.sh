#!/bin/sh

sh /wait-for postgres:5432 -t 60 -- echo "is Up postgres"
sh /wait-for redis:6379 -t 60 -- echo "is Up redis"
sh /wait-for cans-web:3000 -t 60 -- echo "is Up cans-web"
sh /wait-for cans-api:8080 -t 90 -- echo "is Up cans-api"
sh /wait-for perry:8080 -t 90 -- echo "is Up perry"
echo "is Up cans-test"
