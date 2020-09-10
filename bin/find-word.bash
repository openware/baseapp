#! /usr/bin/bash

file=${file}
word=${word}

while [ $# -gt 0 ]; do

     if [[ $1 == *"--"* ]]; then
          param="${1/--/}"
          declare $param="$2"
     fi

  shift
done

grep $word $file
