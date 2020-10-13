#! /usr/bin/bash

ionic capacitor add android

ionic capacitor copy android && cd android && ./gradlew assembleDebug && cd ..