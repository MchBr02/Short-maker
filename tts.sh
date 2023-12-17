#!/bin/bash


# Create a new directory for the .wav files
mkdir -p audioFiles/

# Create a new directory for the .wav files
mkdir -p audioFiles/$(date '+%d.%m.20%y-wav')/


# Change to the directory where the .txt files are located
cd txtFiles/$(date '+%d.%m.20%y-txt')/



#Loop through each .txt file in the directory
#for file in *.txt
#do
#larynx -v en-us/cmu_ahw-glow_tts --raw-stream < "$file" | ffmpeg -f s16le -ar 22050 -ac 1 -i - -codec:a libmp3lame -qscale:a 2 ../../audioFiles/"$(date '+%d.%m.20%y-wav')/${file%.*}.mp3"
#done


#Loop through each .txt file in the directory
for file in *.txt
do
    larynx -v cmu_fem --length-scale 1.1 --raw-stream < "$file" | ffmpeg -f s16le -ar 22050 -ac 1 -i - -codec:a libmp3lame -qscale:a 2 ../../audioFiles/"$(date '+%d.%m.20%y-wav')/${file%.*}.mp3" &
    pid=$!
    wait $pid
done



# To dziaua
#larynx -v en --raw-stream < txtFiles/13.04.2023-txt/3-drunk-guys-entered-a-taxi.txt | ffmpeg -f s16le -ar 22050 -ac 1 -i - -codec:a libmp3lame -qscale:a 2 audioFiles/output.mp3

cd ../../
pwd
