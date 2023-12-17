#!/bin/bash

cd soundVideoFiles/$(date '+%d.%m.20%y-sv')/

for file in *.mp4
do
    cd ../../
    node vosk-srtv3.2.js "$file"
    pid=$!
    wait $pid
    cd soundVideoFiles/$(date '+%d.%m.20%y-sv')/
done

cd ../../
pwd
