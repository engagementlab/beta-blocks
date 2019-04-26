#!/bin/bash

ssh deploy@"$1";
git pull origin master;
sh deploy.sh qa;