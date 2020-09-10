#! /usr/bin/bash

git=${git}
folder=${folder}

while [ $# -gt 0 ]; do

   if [[ $1 == *"--"* ]]; then
        param="${1/--/}"
        declare $param="$2"
   fi

  shift
done

cd src/plugins && rm -rf $folder
git clone $git $folder
