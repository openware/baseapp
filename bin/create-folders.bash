#! /usr/bin/bash

plugin=${plugin}

while [ $# -gt 0 ]; do

   if [[ $1 == *"--"* ]]; then
        param="${1/--/}"
        declare $param="$2"
   fi

  shift
done

mkdir -m -R g+rw -p src/plugins/$plugin
mkdir -p src/plugins/$plugin/components src/plugins/$plugin/containers src/plugins/$plugin/modules
