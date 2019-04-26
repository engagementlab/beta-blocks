#!/bin/bash

# Ensure in root and run deploy after logging in
ssh -i travis_rsa travis@"$1" "cd /srv/beta-blocks/source && git pull origin master && sh deploy.sh qa"