
#1) Download posts from subreddit as .txt
node redditToTxtv4.js
    pid=$!
    wait $pid

#2) Generate voiceover.mp3 for each post.txt
./tts.sh
    pid=$!
    wait $pid

#3) Add some intro laughter to voiceover.mp3 and save as finalAudio.mp3
node concatenateAudioV2.js
    pid=$!
    wait $pid

#4) Combine finalAudio.mp3 with random BG-video.mp4
node soundVideoV3.js
    pid=$!
    wait $pid

#5) create subtitles.srt
./vosk-srtv.sh
    pid=$!
    wait $pid

#6) Add subtitles.srt to soundVideo.mp4
python3 videoSubtitlesV4.4.py
    pid=$!
    wait $pid

#7) Post created files on youtube
node ytUpload.js
    pid=$!
    wait $pid
