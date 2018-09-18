#!/bin/bash -e

type=$1
if [ $type = 'beta' ] ; then
    echo "Switching to beta ids"
else
    if [ $type = 'prod' ] ; then
        echo "Switching to live ids"
    else
        echo "Unknown type: $type (should be 'beta' or 'prod')"
        exit 1
    fi
fi

for row in $(cat "./taskIds.json" | jq -c '.tasks[]'); do
    _jq() {
        echo ${row} | jq -r ${1}
    }

    # get the correct id
    newId=$(_jq '."beta-id"')
    if [ $type = 'prod' ] ; then
        newId=$(_jq '.id')
    fi 

    # get the path to the task.json file
    fullTaskJsonPath=$PWD/$(_jq '.path')/task.json
    jq '.id = $newId' $fullTaskJsonPath --arg newId $newId > temp.json && mv temp.json $fullTaskJsonPath
done