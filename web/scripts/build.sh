#!/bin/sh

export REACT_APP_GIT_SHA=$(git rev-parse --short HEAD)
export BUILD_DOMAIN=$(test -e .domains && cat .domains)
[ -n "$BUILD_EXPIRE" ] && export REACT_APP_BUILD_EXPIRE=$(date -d "+${BUILD_EXPIRE}" +%s000)

yarn build
