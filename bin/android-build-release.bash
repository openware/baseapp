#! /usr/bin/bash

keystore_path=${keystore_path}
keystore_pass=${keystore_pass}
keystore_alias=${keystore_alias}
android_sdk_root=${android_sdk_root}

while [ $# -gt 0 ]; do

    if [[ $1 == *"--"* ]]; then
        param="${1/--/}"
        declare $param="$2"
    fi

    shift
done

cd android
echo sdk.dir=$android_sdk_root > local.properties
./gradlew assembleRelease
cd app/build/outputs/apk/release
jarsigner -keystore $keystore_path -storepass $keystore_pass app-release.apk $keystore_alias
zipalign 4 app-release-unsigned.apk baseapp-release.apk