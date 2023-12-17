# Short-maker
Short maker will help you with regular video posting.

First create file credentials.js (check credentials-example.js)

To start run thise: script: ./start.sh

or individually:
#1) Download posts from subreddit as .txt
node redditToTxtv4.js


#2) Generate voiceover.mp3 for each post.txt
./tts.sh


#3) Add some intro laughter to voiceover.mp3 and save as finalAudio.mp3
node concatenateAudioV2.js


#4) Combine finalAudio.mp3 with random BG-video.mp4
node soundVideoV3.js


#5) create subtitles.srt
./vosk-srtv.sh



#6) Add subtitles.srt to soundVideo.mp4
python3 videoSubtitlesV4.4.py


#7) Post created files on tiktok and youtube
node app.js