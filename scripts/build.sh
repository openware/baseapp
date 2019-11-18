#!/bin/sh

export REACT_APP_GIT_SHA=$(git rev-parse --short HEAD)
if [ $REACT_APP_BUILD_VERSION = "Enterprise" ]
then
  export BUILD_DOMAIN=${BUILD_DOMAIN:-$(cat .domains)}
  [ -n "$BUILD_EXPIRE" ] && export REACT_APP_BUILD_EXPIRE=$(date -d "+${BUILD_EXPIRE}" +%s000)
fi

yarn build
